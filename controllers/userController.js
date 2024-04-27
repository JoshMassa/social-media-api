const { Schema } = require('mongoose');
const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .select('-__v');

            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts')
                .populate('friends')
                .select('-__v');

                if (!user) {
                    return res.status(404).json({ message: 'No user found with that ID' });
                }

                res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const userData = await User.create(req.body);
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email field is required to update' })
            }
            
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { email: req.body.email},
                { new: true, runValidators: true }
            );

            if (!userData) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            res.json(userData);
        } catch (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json(err);
            } else {
                res.status(500).json(err);
            }
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID'});
            }

            const deletedThoughts = await Thought.deleteMany({ username: user.username });
            if (deletedThoughts.deletedCount === 0) {
                return res.status(404).json({ message: 'No thoughts found with that ID, or the thoughts were already deleted'})
            }
            
            const deletedUser = await User.findByIdAndDelete(req.params.userId);
            if (!deletedUser) {
                return res.status(404).json({ message: 'No user found with that ID, or the user was already deleted'})
            }

            res.json({ message: `Profile and all associated thoughts by ${user.username} have successfully been deleted` });
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    async addFriend(req, res) {
        try {
            const user = getSingleUser();
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID'});
            }

            const friends = user.friends
        } catch (err) {
            res.status(500).json(err);
        }
    }
};