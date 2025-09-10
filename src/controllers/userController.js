import { createUserService, getAllUsersService } from "../models/userModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createUser = async (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    try{
        const newUser = await createUserService(fname, lname, email, password);
        handleResponse(res, 201, 'User created successfully', newUser);
    } catch(err){
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try{
        const users = await getAllUsersService();
        handleResponse(res, 202, 'Users fetched successfully', users);
    } catch(err){
        next(err);
    }
};
