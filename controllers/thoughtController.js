const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()
      return res.json(thoughts)
    } catch(err) { return res.status(500).json(err)};
  },

async getSingleThought(req, res) {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
},
  // posts to api/thoughts, requires {userId, thoughtText, username}
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'Thought created, but found no user with that ID' });
      }
      return res.json('Created the thought 🎉');
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
    // update existing thought at api/thoughts/:_id
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return res.json(thought);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    },
// delete by _id api/thoughts/:_id
async deleteThought(req, res) {
  try {
    const thought = await Thought.findOneAndRemove({
      _id: req.params.thoughtId,
    });
    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }
    const user = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({message: 'Thought created but no user with this id!'});
    }
    return res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    return res.status(500).json(err);
  }
},

  // post to api/thoughts/:thought_id/reactions
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );  
      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }  
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

    // delete to api/thoughts/:thought_id/reactions/reaction_id

async removeReaction(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);
  }
}};
