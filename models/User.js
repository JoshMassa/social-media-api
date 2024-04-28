// Require necessary packages
const { Schema, model } = require('mongoose');
// Define new userSchema
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true, // Username must not already exist in the database
            required: true, // Makes username a required field
            trim: true // Remove whitespace from both sides of the string
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ // Regular expression to match an email address
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId, // Define the data type as an ObjectId using the mongoose package
                ref: 'thought' // References the thought collection
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId, // Define the data type as an ObjectId using the mongoose package
                ref: 'user' // References the user collection
            }
        ]
    },
    {
        toJSON: {
            virtuals: true, // Includes virtual properties when documents are converted to JSON format
            versionKey: false // Disables the inclusion of the version key "__v"
        },
        id: false
    }
);

userSchema
    .virtual('friendCount') // Define a virtual property 'friendCount'
    .get(function () {
        return this.friends.length; // Calculate and return the number of friends a user has
    });
// Compile the userSchema into a User model and specifies the collection name 'user'
const User = model('user', userSchema);

module.exports = User;