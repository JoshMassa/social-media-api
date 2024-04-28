// Require necessary packages and files
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
// Define new thoughtSchema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (val) => {
                // Format the timestamp
                const timestampFormatter = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                return timestampFormatter.format(val);
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema] // Defines a reaction field as an array of subdocuments structured according to the 'reactionSchema'
    },
    {
        toJSON: {
            getters: true, // Enables getter functions when converting MongoDB documents to JSON format
            virtuals: true, // Includes virtual properties when documents are converted to JSON format
            versionKey: false // Disables the inclusion of the version key "__v"
        },
        id: false
    }
);

thoughtSchema
    .virtual('reactionCount') // Define a virtual property 'reactionCount'
    .get(function () {
        return this.reactions.length; // Calculate and return the number of reactions in the 'reactions' array
    });
// Compile the thoughtSchema into a Thought model and specifies the collection name 'thought'
const Thought = model('thought', thoughtSchema);

module.exports = Thought;