const { Thought, User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();

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

            const user = await User.findOneAndUpdate(
                { username: req.body.username },
                { email: req.body.email },
                { new: true }
            );

            res.json(userData);
        } catch (err) {
            res.status(500).json({ message: 'Error creating user'});
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
                res.status(500).json({ message: 'Error updating user' });
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
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        
        try {
            if (userId === friendId) {
                return res.status(400).json({ message: 'Users cannot add themselves as a friend'});
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { friends: friendId } },
                { new: true, runValidators: true }
            ).populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID'});
            }

            const friend = await User.findByIdAndUpdate(
                friendId,
                { $addToSet: { friends: userId } },
                { new: true, runValidators: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            res.json({ message: `${user.username} and ${friend.username} are now friends!`})
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeFriend(req, res) {
        const userId = req.params.userId;
        const friendId = req.params.friendId;

        try {
            if (userId === friendId) {
                return res.status(400).json({ message: 'Users cannot remove themsevles as a friend'})
            }

            const userUpdate = await User.findByIdAndUpdate(
                userId,
                { $pull: { friends: friendId } },
                { new: true }
            );

            if (!userUpdate) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            const friendUpdate = await User.findByIdAndUpdate(
                friendId,
                { $pull: { friends: userId } },
                { new: true }
            );

            if (!friendUpdate) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            res.json({ message: `${userUpdate.username} and ${friendUpdate.username} are no longer friends`})
        } catch (err) {
            res.status(500).json({ message: 'Failed to remove friend', error: err});
        }
    }
};