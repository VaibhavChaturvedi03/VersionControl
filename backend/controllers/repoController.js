const createRepo = (req, res) => {
    res.send('Create Repository');
};

const getAllRepo = (req, res) => {
    res.send('Get All Repositories');
};

const getRepoById = (req, res) => {
    res.send('Get Repository with ID');
};

const getRepoByName = (req, res) => {
    res.send('Get Repository with Name');
};

const fetchRepoForCurrentUser = (req, res) => {
    res.send('Get Repository for current User');
};

const updateRepoById = (req, res) => {
    res.send('Repo Updated');
};

const toggleVisibilityById = (req, res) => {
    res.send('visibility Toggled');
};

const deleteRepoById = (req, res) => {
    res.send('Repo Deleted');
};

module.exports = {
    createRepo,
    getAllRepo,
    getRepoById,
    getRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    toggleVisibilityById,
    deleteRepoById,
};