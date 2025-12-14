const mongoose = require('mongoose');
const Repository = require('../models/repo');
const User = require('../models/user');
const Issue = require('../models/issue');

async function createRepo (req, res) {
    const {owner,name,issues,content,description,visibility} = req.body;
    
    try{
        if(!name){
            return res.status(400).json({message: 'Repository name is required'});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({message: 'Invalid user ID'});
        }

        const newRepo = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues,
        });

        const result = await newRepo.save();

        res.status(201).json({
            message: 'Repository created successfully',
            repositoryID : result._id,
        });

    }catch(err){
        console.error('Error during creating repository:', err.message);
        res.status(500).send('Server Error');
    };
};

async function getAllRepo (req, res) {
    res.send('Get All Repositories');
};

async function getRepoById (req, res) {
    res.send('Get Repository with ID');
};

async function getRepoByName (req, res) {
    res.send('Get Repository with Name');
};

async function fetchRepoForCurrentUser (req, res) {
    res.send('Get Repository for current User');
};

async function updateRepoById (req, res) {
    res.send('Repo Updated');
};

async function toggleVisibilityById (req, res) {
    res.send('visibility Toggled');
};

async function deleteRepoById (req, res) {
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