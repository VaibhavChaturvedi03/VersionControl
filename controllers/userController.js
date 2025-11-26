const getAllUsers = (req, res) => {
    res.send('Get all users');
};

const signup = (req, res) => {
    res.send('User signup');
};

const login = (req, res) => {
    res.send('User login');
};

const getUserProfile = (req, res) => {
    res.send('Profile Fetched');
};

const updateUserProfile = (req, res) => {
    res.send('profile Updated');
};

const deleteUserProfile = (req, res) => {
    res.send('profile deleted');
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};