const { User, Thought } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought found with ID that was given" });
      }
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message:
            "Thought has been created, but no user was found with that ID",
        });
      }

      res.json("Thought succesfully created");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'Found no thought with this ID' });
        }
  
        res.json(thought);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
  async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No video with this id!' });
        }
  
        const user = await User.findOneAndUpdate(
          { videos: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Thought created with no user ID' });
        }
  
        res.json({ message: 'Thought has been successfully deleted' });
      } catch (err) {
        res.status(500).json(err);
      }
    },
    async addThoughtReaction(req,res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );
            if (!thought){
                return res.status(404).json({ message: 'No thought with this ID'});
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $pull: { reactions: { reactionId: req.param.reactionId}}},
                { runValidators: true, new: true }
            )
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};
