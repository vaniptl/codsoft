import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
    const { name, email, password, lastName, location } = req.body;
    //validate
    if (!name) {
        next('Name is required');
    }
    if (!email) {
        next('Email is required');
    }
    if (!password) {
        next('Password is required');
    }
    

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        next(' Email Already register please login');
    }

    const user = await userModel.create({ name, email, password, lastName, location });
    //token
    const token = user.createJWT()
    res.status(201).send({
        success: true,
        message: "User created Successfully",
        user,
        token,
    });

};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        next('Please provide all fields');
    }
    //find user by email
    const user = await userModel.findOne({ email })
    if (!user) {
        next('Invalid email or password');
    }

    //compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next('Invalid email or password');
    }
    const token = user.createJWT();
    res.status(200).json({
        success:true,
        message: 'Login successfully',
        user,
        token,
    })

};