const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  // i would also like this to return the user thoughts
  async getUsers(req, res) {
    try {
      const users = await User.find()
      .populate('thoughts')
      .populate('friends');
      return res.json(users);
    } catch (err) {
      return res.status(500).json(err)
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try { 
    const user = await User.findOne({ _id: req.params.userId })
    .populate('thoughts')
    .select('-__v')
      if (!user) {
        return (res.status(404).json({ message: "No user with that Id!"}))
      }
      return res.json(user);
    } catch (err) {
      return (res.status(500).json(err))
    }
  },
// update a single user
async updateUser(req, res) {
  try{
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId},
      {$set: req.body},
      {runValidators: true, new: true}
    );
    if(!user) {
      return res.status(404).json({ message: "No user with that Id!"})
    }
    return res.json(user);
  } catch(err) {
    return res.status(500).json(err)
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
        {_id: req.params.userId},
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
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendsId } },
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
