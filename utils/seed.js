const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomThoughts, getThoughtReactions, usernames } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connection Successful');

    let reactionCheck = await connection.db
        .listCollections({ name: 'reactions' })
        .toArray();
    if (reactionCheck.length) {
        await connection.dropCollection('reactions');
    }

    let thoughtCheck = await connection.db
        .listCollections({ name: 'thoughts' })
        .toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }

    let userCheck = await connection.db
        .listCollections({ name: 'users' })
        .toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }

    const users = [];
    const randomUsernames = usernames.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(5, randomUsernames.length); i++) {
        const username = randomUsernames[i];
        const email = `${username.toLowerCase().replace(/\s+/g, '')}@example.com`;
        const randomThoughts = getRandomThoughts(Math.ceil(Math.random() * 3));

        const thoughts = [];
        for (let j = 0; j < randomThoughts.length; j++) {
            const thoughtReactions = getThoughtReactions(Math.ceil(Math.random() * 5));
            const newThought = await Thought.create({
                thoughtText: randomThoughts[j].thoughtText,
                username,
                reactions: thoughtReactions
            });
            thoughts.push(newThought._id)
        }

        users.push({
            username,
            email,
            thoughts
        });
    }

    try {
        await User.collection.insertMany(users);
        console.log('Users successfully inserted');
    } catch (error) {
        console.error('Error inserting users: ', error);
        return;
    }

    console.info('Seeding complete! 🌱');
    process.exit(0);
});