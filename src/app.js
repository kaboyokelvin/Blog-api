import express from "express";
import mongoose from "mongoose";
import { PostModel, UserModel } from './models/index.js';

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/blog", { useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {
    console.log("mongodd connected successfully");
})
.catch((error) => {
    console.log("mongod did not connected successfully: ", error?.message);
})

const authenticationMiddleWare = async (req, res, next) => {
    try {
        const {token, userid} = req.headers
        console.log(Object.keys(req.headers), "userId")
        if (Number(token) !== 1234) {
            throw new Error("Unauthorized user")
        }
        req.userId = userid;
        next();
    } catch (error) { return res.status(500).json({ message: error?.message }) }
}

app.post('/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username, password })
        console.log(user,  !user)
        if (!user) {
            throw new Error("Unauthorized user")
        }
        res.status(200).json({ token: 1234, userId: user._id })
    } catch (error) { return res.status(500).json({ message: error?.message }) }
})

app.post('/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        await UserModel.create({
            username,
            password,
            email
        })
        res.status(201).json({
            message: "successfully registered"
        })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened", error: error?.message })
    }
})

app.post('/posts', authenticationMiddleWare, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.userId;
        await PostModel.create({ title, content, user: userId })
        res.status(201).json({message: "Post created successfully"})
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" , error: error?.message })
    }
})

app.get('/posts/:id', authenticationMiddleWare, async (req, res) => {
    try {
        const post = await PostModel.findOne({ _id: id });
        res.status(200).json({ post })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
    }
})

app.get('/posts', authenticationMiddleWare, async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await PostModel.find({ user: userId }).populate('user');
        res.status(200).json({ posts })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
    }
})

app.delete('/posts/:id', authenticationMiddleWare, async (req, res) => {
    try {
        const userId = req.userId;
        const postCheck = await PostModel.findOne({ user: userId, _id: id })
        if (!postCheck) {
            return res.status(401).json({ message: 'You have no permissions to delete this post!' })
        }
        const posts = await PostModel.delete({ _id: req.params.id });
        res.status(200).json({ posts })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
    }
})

app.put('/posts/:id', async (req, res) => {
    try {
        const userId = req.userId;
        const postCheck = await PostModel.findOne({ user: userId, _id: id })
        if (!postCheck) {
            return res.status(401).json({ message: 'You have no permissions to edit this post!' })
        }
        const posts = await PostModel.update({ _id: req.params.id }, { ...req.body });
        res.status(200).json({ posts })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
    }
})

export default app;