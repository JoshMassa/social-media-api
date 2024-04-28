// Require necessary packages and files
const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomThoughts, getRandomUser, getThoughtReactions } = require('./data');
// Set up error event listener and log any errors
connection.on('error', (err) => err);
console.log('Error: ', err);
// Set up event listener to trigger a function once when the MongoDB connection is successfully opened
connection.once('open', async () => {
    console.log('Connection Successful');
    // Check if any reactions exist and drop them before seeding
    let reactionCheck = await connection.db
        .listCollections({ name: 'reactions' })
        .toArray();
    if (reactionCheck.length) {
        await connection.dropCollection('reactions');
    }
    // Check if any thoughts exist and drop them before seeding
    let thoughtCheck = await connection.db
        .listCollections({ name: 'thoughts' })
        .toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }
    // Check if any users exist and drop them before seeding
    let userCheck = await connection.db
        .listCollections({ name: 'users' })
        .toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }
    // Initialize an empty array of users
    const users = [];
    // Initialize new 'Set' object to store unique usernames, ensuring each username can only appear in the set once
    const usedUsernames = new Set();
    // Repeatedly generage a random username until one is found that does not already exist in the 'usedUsernames' set
    for (let i = 0; i < 5; i++) {
        let username;
        do {
            username = getRandomUser();
        } while (usedUsernames.has(username));
        // Once a unique username is generated, add it to the usedUsernames set to ensure it is not reused
        usedUsernames.add(username);
        // Define the seeding structure for a user's email. This will take their username, convert it all to lowercase, and then append @example.com to the end of it
        const email = `${username.toLowerCase()}@example.com`;
        // Initialize an empty array of friends
        const friends = [];
        // Call the getRandomThoughts function with an argument of 3 to generate an array of three random thought texts
        const thoughtText = getRandomThoughts(3);

        let thoughts;
        try {
            // Map over array of thought texts and generate a new document for each text
            thoughts = await Thought.insertMany(thoughtText.map(text => {
                // For each thought, calculate a random number of reactions to seed to each thought, up to 5 reactions
                const reactions = getThoughtReactions(Math.ceil(Math.random() * 5)).map(reaction => ({
                    // Each reaction is then mapped to a new object containing only the reactionBody and username properties
                    reactionBody: reaction.reactionBody,
                    username: reaction.username
                }));
                // Maps each thought text to a new object containing the thought text, username, and an array of reactions
                return {
                    thoughtText: text,
                    username,
                    reactions
                };
            }));
            // Extract the '_id' property from each document in the 'thoughts' array creating a new array containing only the '_id' values of each document
            const thoughtIds = thoughts.map(doc => doc._id)
            // Adds a new object containing a username, email, an array of thoughtIds, and friends to the 'users' array
            users.push({
                username,
                email,
                thoughts: thoughtIds,
                friends
            });
        // Catch errors and log the error to the console
        } catch (err) {
            console.error('Error inserting thoughts for', username, ': ', err);
        }
    }

    try {
        // Insert multiple user documents into the database and if successful, log a message to the console
        const userData = await User.insertMany(users);
        console.log('Users successfully inserted');
    // Catch errors and log the error to the console
    } catch (err) {
        console.error('Error inserting users: ', err)
    }
    // Let the user know the seeding was completed successfully
    console.info('Seeding complete! 🌱');
    // Terminate the node.js process
    process.exit(0);
});