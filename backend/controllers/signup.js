const User = require('../models/signup')

exports.createUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.create({name, email, password});
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
        res.status(500).json({status: false, message: 'Internal Server Error'});
    }
}