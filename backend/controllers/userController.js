const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        if (!uri) {
            throw new Error('MongoDB connection string is not set. Set MONGODB_URI in .env');
        }
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function signup(req, res) {
    const { username, password, email } = req.body || {};
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'username, password and email are required' });
    }
    try {
        await connectClient();
        const db = client.db("versioncontrol");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
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
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during signup:', error && error.stack ? error.stack : error);
        res.status(500).send('Server Error');
    }
};

async function login(req, res) {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("versioncontrol");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userID: user._id });
    } catch (error) {
        console.error('Error during login :', error.message);
        res.status(500).send('Server Error');
    };
};

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server error!");
    };
};

async function getUserProfile(req, res) {
    const currentID = req.params.id;

    try {
        await connectClient();
        const db = client.db("versioncontrol");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID),
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.send(user);
    } catch (err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server error!");
    };
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
