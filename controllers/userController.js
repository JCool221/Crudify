const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  // Get a single user
// currently not working
  async getSingleUser(req, res) {
    try { 
    const user = await User.findOne({ _id: req.params.userId })
      .select('-__v')
      if (!user) {
        return (res.status(404).json({ message: "No user with that Id!"}))
      }
      return res.json(user);
    } catch (err) {
      return (res.status(500).json(err))
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
    const user = await User.create(req.body)
      return res.json(user);
    }catch (err){
      return (res.status(500).json(err));
    }
  },

  // Delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
    const user = await User.findOneAndDelete({ _id: req.params.userId })
      if(!user) {
        return (res.status(404).json({ message: 'No user with that ID' }))
      }
      await Thought.deleteMany({_id: {$in: user.thoughts}})
      return res.json({message: "User and associtaed thoughts deleted!"})
    } catch(err) {
      return res.json(500).json(err);
    }
  },
  // add friend
  async addFriend( req,res) {
    try {
      const user = await User.findOneAndUpdate(
        {_id: req.params.userID},
        {$addToSet: {friends: req.body}},
        {runValidators: true, new: true}
        )
        if(!user) {
          return res.status(404).json({message: "No user with that Id!"})
        }
        return res.json(user)        
      }
    catch(err) {
      return res.status(500).json(err);
    }
  },
  // delete friend
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userID },
        { $pull: { friends: { friendID: req.params.friendID } } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that Id!" });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};
