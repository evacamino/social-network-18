const { User } = require('../models');

module.exports = {
    async getUsers(req,res){
        try {
            const users = await User.find();
            res.json(users);
        } catch (err){
            res.status(500).json(err);
        }
    },
    async getSingleUser(req,res){
        try{
            const user = await User.findOne({_id: req.params.userId})
            .select('-__v');
            if (!user) {
                return res.status(404).json({ message: 'No user found with ID that was given'});
            }
            res.json(user);
        
        } catch(err){
            res.status(500).json(err);
        }
    },
    async createUser(req,res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async updateUser(req,res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                { $set: req.body },
                { runValidators: true, new: true}
            )
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteUser(req,res) {
        try {
            const user = await User.findOneAndDelete({_id: req.params.userId});
            if (!user) {
                res.status(404).json({ message: 'No user found with the ID that was given'})
            }
            await User.deleteMany({_id: { $in: user.thoughts}});
            res.json({ message: "Users and thoughts have been deleted"}); 
        } catch (err) {
            res.status(500).json(err);
        }
    }
}