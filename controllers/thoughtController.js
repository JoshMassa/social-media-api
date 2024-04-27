const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()

            res.json(thoughts);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving thoughts' });
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching thought' });
        }
    },
    async newThought(req, res) {
        try {
            const thoughtData = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { thoughts: thoughtData._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            res.json({ user: user.username, thought: thoughtData });
        } catch (err) {
            res.status(500).json({ message: 'Error adding new thought' });
        }
    },
    async updateThought(req, res) {
        try {
            if (!req.body.thoughtText) {
                return res.status(400).json({ message: 'thoughtText field is required to update' })
            }

            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { thoughtText: req.body.thoughtText },
                { new: true, runValidators: true }
            );

            if (!thoughtData) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            res.json(thoughtData)
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
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            res.json({ message: 'Thought deleted successfully!' });
        } catch (err) {
            res.status(500).json({ message: 'Error deleting thought' });
        }
    },
    async newReaction(req, res) {
        try {
            const thoughtId = req.params.thoughtId;

            const thought = await Thought.findById(thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            const newReaction = {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            };

            thought.reactions.push(newReaction);

            await thought.save();

            const addedReaction = thought.reactions[thought.reactions.length - 1];

            const response = {
                message: 'Reaction added successfully!',
                thought: {
                    _id: thoughtId,
                    thoughtText: thought.thoughtText,
                    createdAt: thought.createdAt,
                    username: thought.username,
                    reaction: addedReaction
                }
            };

            res.json(response);
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