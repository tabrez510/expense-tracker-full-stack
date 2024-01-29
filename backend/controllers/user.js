const bcrypt = require('bcrypt');
const User = require('../models/user')

exports.createUser = async (req, res) => {

    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({name, email, password: hashedPassword});
        res.json({success: true, exists: false, ...user.dataValues});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, err: err, message: 'Internal Server Error'});
    }
}

exports.checkEmail = async (req, res) => {
    const {email} = req.body;

    try {
        const existingUser = await User.findOne({where : { email }});
        if(existingUser) {
            return res.json({ exists: true, error: 'Email already exists'});
        } else {
            return res.json({exists: false});
        }
    } catch(err) {
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

exports.checkPassword = async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({where : { email }});
        if(!existingUser) {
            return res.status(404).json({match: false, message: 'User not found'});
        }
        else {
            const hashedPasswordFromDatabase = existingUser.password;

            const isMatch = await bcrypt.compare(password, hashedPasswordFromDatabase);

            if(isMatch){
                return res.status(200).json({match: true, message: null});
            }
            else {
                return res.status(401).json({match: false, message: 'Incorrect password'});
            }
        }
    } catch(err){
        res.status(500).json({success: false, message: "Internal Server error"});
    }
}