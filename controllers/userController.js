// Require necessary models
const { Thought, User } = require('../models');
// Export all controllers so they can be used in routes
module.exports = {
    async getUsers(req, res) {
        try {
            // Get all users
            const users = await User.find();
            // Send 'users' data to client in JSON format
            res.json(users);
        // Catch errors and send JSON message to client  
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            // Find a specific user based on their ID
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts') // Populate the user with 'thoughts' data
                .populate('friends') // Populate the user with 'friends' data
            // If the specific user does not exist, return this error
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }
            // If the specific user was found, send 'user' data to client in JSON format
            res.json(user);
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error fetching user' });
        }
    },
    async createUser(req, res) {
        try {
            // Create a new document in the MongoDB database using the 'User' model with the data provided in req.body and store it in the 'userData' variable
            const userData = await User.create(req.body);

            const user = await User.findOneAndUpdate(
                { username: req.body.username }, // Find a specific user via their username
                { email: req.body.email }, // Update user's email with the value received from req.body
                { new: true } // Return the updated document
            );
            // If the specific user was successfully created, send 'userData' data to client in JSON format
            res.json(userData);
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error creating user'});
        }
    },
    async updateUser(req, res) {
        try {
            // If email was not included in the body of the request, return this error
            if (!req.body.email) {
                return res.status(400).json({ message: 'Email field is required to update' })
            }
            
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId }, // Find a specific user via their ID
                { email: req.body.email}, // Update user's email with the value received from req.body
                { new: true, runValidators: true } // Ensure the modified document is returned after updating and validate the update against the schema 
            );
            // If no user was found, return this error
            if (!userData) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }
            // If the specific user was found and updated, send 'userData' data to client in JSON format
            res.json(userData);
        // Catch errors and send JSON message to client
        } catch (err) {
            if (err.name === 'ValidationError') {
                res.status(400).json({ message: 'Error occured during validation' });
            } else {
                res.status(500).json({ message: 'Error updating user' });
            }
        }
    },
    async deleteUser(req, res) {
        try {
            // Find a document via its userId from the request parameteres
            const user = await User.findById(req.params.userId);
            // If no user was found with that ID, return the following error
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID'});
            }
            // Delete all thought documents from the database where the username field matches the username of a specified user and store the result in the 'deletedThoughts' variable
            const deletedThoughts = await Thought.deleteMany({ username: user.username });
            // Check whether any thoughts were deleted. If none were deleted, return the following error
            if (deletedThoughts.deletedCount === 0) {
                return res.status(404).json({ message: 'No thoughts found with that ID, or the thoughts were already deleted'})
            }
            // Find a document via its userId from the request parameters and delete it from the database, storing the deleted document in the 'deletedUser' variable
            const deletedUser = await User.findByIdAndDelete(req.params.userId);
            // If the specific user was not found, return the following error
            if (!deletedUser) {
                return res.status(404).json({ message: 'No user found with that ID, or the user was already deleted'})
            }
            // If the specific user was found, send the following message to the client in JSON format
            res.json({ message: `Profile and all associated thoughts by ${user.username} have successfully been deleted` });
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error deleting user' });
        }
    },
    async addFriend(req, res) {
        // Retrieve userId from the URL parameters of the request and store it in the 'userId' variable
        const userId = req.params.userId;
        // Retrieve friendId from the URL parameters of the request and store it in the 'friendId' variable
        const friendId = req.params.friendId;
        
        try {
            // If the userId and the friendId match, return the following error
            if (userId === friendId) {
                return res.status(400).json({ message: 'Users cannot add themselves as a friend'});
            }

            const user = await User.findByIdAndUpdate(
                userId, // Find a specific user via their ID
                { $addToSet: { friends: friendId } }, // Add a friendId to the user's 'friends' array without allowing duplicates
                { new: true, runValidators: true } // Ensure the modified document is returned after updating and validate the update against the schema
            ).populate('friends'); // Populate the 'friends' field with friend data
            // If the specified user was not found, return the following error
            if (!user) {
                return res.status(404).json({ message: 'No user found with that ID'});
            }

            const friend = await User.findByIdAndUpdate(
                friendId, // Find a specific friend via their ID
                { $addToSet: { friends: userId } }, // Add a userId to their 'friends' array to ensure duplicate entries are not allowed
                { new: true, runValidators: true } // Ensure the modified document is returned after updating and validate the update against the schema
            );
            // If the specified friend was not found, return the following error
            if (!friend) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }
            // If the user successfully added a friend, send the following message to the client in JSON format
            res.json({ message: `${user.username} and ${friend.username} are now friends!`})
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Error adding friend' });
        }
    },
    async removeFriend(req, res) {
        // Retrieve userId from the parameter of the request and store it in the 'userId' variable
        const userId = req.params.userId;
        // Retrieve friendId from the parameter of the request and store it in the 'friendId' variable
        const friendId = req.params.friendId;

        try {
            // If the userId and friendId match, return the following error
            if (userId === friendId) {
                return res.status(400).json({ message: 'Users cannot remove themsevles as a friend'})
            }

            const userUpdate = await User.findByIdAndUpdate(
                userId, // Find a specific user via their ID
                { $pull: { friends: friendId } }, // Remove a specific friend via their friendId
                { new: true } // Return the updated document
            );
            // If the specified user or friend was not found, return the following error
            if (!userUpdate) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            const friendUpdate = await User.findByIdAndUpdate(
                friendId, // Find a specific user via their friendId
                { $pull: { friends: userId } }, // Remove userId from friends array
                { new: true } // Return the updated document
            );
            // If no user was found with that ID, send the following message to the client
            if (!friendUpdate) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }
            // If the user's friend was successfully removed, send the following message to the client
            res.json({ message: `${userUpdate.username} and ${friendUpdate.username} are no longer friends`})
        // Catch errors and send JSON message to client
        } catch (err) {
            res.status(500).json({ message: 'Failed to remove friend', error: err});
        }
    }
};