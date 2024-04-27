const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomThoughts, getRandomUser, getThoughtReactions } = require('./data');

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
    const usedUsernames = new Set();

    for (let i = 0; i < 5; i++) {
        let username;
        do {
            username = getRandomUser();
        } while (usedUsernames.has(username));
        usedUsernames.add(username);

        const email = `${username.toLowerCase()}@example.com`;
        const friends = [];
        const thoughtText = getRandomThoughts(3);

        let thoughts;
        try {
            thoughts = await Thought.insertMany(thoughtText.map(text => {
                const reactions = getThoughtReactions(Math.ceil(Math.random() * 5)).map(reaction => ({
                    reactionBody: reaction.reactionBody,
                    username: reaction.username
                }));

                return {
                    thoughtText: text,
                    username,
                    reactions
                };
            }));
        
            const thoughtIds = thoughts.map(doc => doc._id)

            users.push({
                username,
                email,
                thoughts: thoughtIds,
                friends
            });
        } catch (err) {
            console.error('Error inserting thoughts for', username, ': ', err);
        }
    }

    try {
        const userData = await User.insertMany(users);
        console.log('Users successfully inserted');
    } catch (err) {
        console.error('Error inserting users: ', err)
    }

    console.info('Seeding complete! 🌱');
    process.exit(0);
});