const { User } = require('../config/config');
const { successResponse, errorResponse } = require('../utils/utils');


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users.length === 0) {
            return res.status(404).json(errorResponse(
                'No users found',
                'USERS_NOT_FOUND',
                'There are no users in the database.',
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Users retrieved successfully',
            { users },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving users',
            'USERS_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};


const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json(errorResponse(
                'User not found',
                'USER_NOT_FOUND',
                `No user found with id ${id}.`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'User retrieved successfully',
            { user },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving user',
            'USER_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json(errorResponse(
                'User not found',
                'USER_NOT_FOUND',
                `No user found with email ${email}.`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'User retrieved successfully',
            { user },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving user',
            'USER_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json(errorResponse(
                'User not found',
                'USER_NOT_FOUND',
                `No user found with id ${id}.`,
                req.originalUrl
            ));
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        res.status(200).json(successResponse(
            'User updated successfully',
            { user },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error updating user',
            'USER_UPDATE_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json(errorResponse(
                'User not found',
                'USER_NOT_FOUND',
                `No user found with id ${id}.`,
                req.originalUrl
            ));
        }

        await user.destroy();

        res.status(200).json(successResponse(
            'User deleted successfully',
            { id },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error deleting user',
            'USER_DELETION_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

module.exports = { getAllUsers ,getUserById, getUserByEmail, updateUser, deleteUser };
