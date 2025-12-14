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
    try{

        const repositories = await Repository.find({}).populate('owner').populate('issues');

        res.json(repositories);

    }catch(err){
        console.error('Error during fetching all repo:', err.message);
        res.status(500).send('Server Error');
    };
};

async function getRepoById (req, res) {
    const {id} = req.params;

    try{
        const repository = await Repository.find({_id: id}).populate('owner').populate('issues');

        res.json(repository);
    }catch(err){
        console.error('Error during fetching repo:', err.message);
        res.status(500).send('Server Error');
    };
};

async function getRepoByName (req, res) {
    const {name} = req.params;

    try{
        const repository = await Repository.find({name}).populate('owner').populate('issues');

        res.json(repository);
    }catch(err){
        console.error('Error during fetching repo:', err.message);
        res.status(500).send('Server Error');
    };
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