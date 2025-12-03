const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

let client;

const getAllUsers = (req, res) => {
    res.send('Get all users');
};

async function connectClient(){
    if (!client) {
        if (!uri) {
            throw new Error('MongoDB connection string is not set. Set MONGODB_URI in .env');
        }
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function signup(req, res){
    const {username, password, email} = req.body || {};
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'username, password and email are required' });
    }
    try{
        await connectClient();
        const db = client.db("versioncontrol");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({username});
        if(user){
            return res.status(400).json({message: 'Username already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUser: [],
            starRepos: [],
        }

        const result = await userCollection.insertOne(newUser);
        const token = jwt.sign({id: result.insertedId}, process.env.JWT_SECRET_KEY,{expiresIn: '1h'});
        res.json({token});
    }catch(error){
        console.error('Error during signup:', error && error.stack ? error.stack : error);
        res.status(500).send('Server Error');
    }
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