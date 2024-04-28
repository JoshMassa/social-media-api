// Require necessary packages
const { Schema, Types } = require('mongoose');
// Define new reactionSchema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId, // Define the data type as an ObjectId using the mongoose package
            default: () => new Types.ObjectId(), // Assigns a new ObjectId as its default value whenever a new document is created
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
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
        }
    },
    {
        toJson: {
            getters: true // Enables getter functions when converting MongoDB documents to JSON format
        },
        id: false
    }
);

module.exports = reactionSchema;