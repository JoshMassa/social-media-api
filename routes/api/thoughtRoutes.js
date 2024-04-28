// Require necessary packages and files
const router = require('express').Router();
const {
    deleteReaction,
    deleteThought,
    getSingleThought,
    getThoughts,
    newReaction,
    newThought,
    updateThought
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(newThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(newReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;