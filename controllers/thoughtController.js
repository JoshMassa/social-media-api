// Import necessary models
const { Thought, User } = require('../models');
// Export all controllers so they can be used in routes
module.exports = {
    async getThoughts(req, res) {
        try {
            // Get all thoughts
            const thoughts = await Thought.find()
            // Send 'thoughts' data to client in JSON format
            res.json(thoughts);
            // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving thoughts' });
        }
    },
    async getSingleThought(req, res) {
        try {
            // Find a specific thought based on its ID
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            // If that thought does not exist, return this error
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            // If the specific thought was found, send 'thought' data to client in JSON format
            res.json(thought);
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error fetching thought' });
        }
    },
    async newThought(req, res) {
        try {
            // Create a new document in the MongoDB database using the 'Thought' model with the data provided in req.body and store it in the 'thoughtData' variable
            const thoughtData = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { username: req.body.username }, // Find a specific user via their username
                { $push: { thoughts: thoughtData._id } }, // Add the ID of the newly created thought to the user's 'thoughts' array
                { new: true } // Ensure the modified document is returned after updating
            );
            // If no user is found, return this error
            if (!user) {
                return res.status(404).json({ message: 'No user found with that username' });
            }
            // Send a JSON response to the client containing the username of the updated user and the data of the newly created thought
            res.json({ user: user.username, thought: thoughtData });
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error adding new thought' });
        }
    },
    async updateThought(req, res) {
        try {
            // If thoughtText was not included in the body of the request, return this error
            if (!req.body.thoughtText) {
                return res.status(400).json({ message: 'thoughtText field is required to update' })
            }

            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId }, // Find a specific thought via its ID
                { thoughtText: req.body.thoughtText }, // Create a new object with a property of 'thoughtText' that is set according to the request body
                { new: true, runValidators: true } // Ensure the modified document is returned after updating and validate the update against the schema
            );
            // If no thought was found return this error
            if (!thoughtData) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            // If the specific thought was found, send 'thoughtData' data to client in JSON format
            res.json(thoughtData)
        // Catch errors and send JSON message to client
        } catch (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json(err);
            } else {
                res.status(500).json(err);
            }
        }
    },
    async deleteThought(req, res) {
        try {
            // Find a document via its thoughtId from the request parameters and delete it from the database, storing the deleted document in the 'thought' variable
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
            // If no thought was found return this error
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            // If the specific thought was found, send this message to the client
            res.json({ message: 'Thought deleted successfully!' });
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error deleting thought' });
        }
    },
    async newReaction(req, res) {
        try {
            // Retrieve thoughtId from the URL parameters of the request and assign it to the variable 'thoughtId'
            const thoughtId = req.params.thoughtId;
            // Find a specific thought via its thoughtId
            const thought = await Thought.findById(thoughtId);
            // If no thought was found return this error
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }
            // Create a 'newReaction' object with the properties reactionBody and username setting their values based on the request body
            const newReaction = {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            };
            // Add the 'newReaction' object to the 'reactions' array of the 'thought' document
            thought.reactions.push(newReaction);
            // Asynchronously save any changes made to the 'thought' document to the database
            await thought.save();
            // Retrieve the last reaction added to the 'reactions' array and store it in the 'addedReaction' variable
            const addedReaction = thought.reactions[thought.reactions.length - 1];
            // Create a 'response' object containing a custom response message
            const response = {
                message: 'Reaction added successfully!',
                thought: {
                    // Keys to include in the response for the 'thought' object
                    _id: thoughtId,
                    thoughtText: thought.thoughtText,
                    createdAt: thought.createdAt,
                    username: thought.username,
                    reaction: addedReaction
                }
            };
            // Send custom response message to the client in JSON format
            res.json(response);
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error adding new reaction' });
            console.log(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thoughtId = req.params.thoughtId;
            const reactionId = req.params.reactionId;

            const thought = await Thought.findById(thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            const reactionToDelete = thought.reactions.find(reaction => reaction.reactionId.toString() === reactionId);
            if (!reactionToDelete) {
                return res.status(404).json({ message: 'No reaction found with that ID' });
            }

            const updateResult = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { reactionId } } },
                { new: true }
            );

            if (!updateResult) {
                return res.status(404).json({ message: 'No thought found with that ID or reaction does not exist' });
            }

            res.json({ message: 'Reaction deleted successfully! Here is the updated thought: ', updatedThought: updateResult });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting reaction' });
            console.log(err);
        }
    }
}