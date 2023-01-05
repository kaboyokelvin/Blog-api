import express from "express";
import mongoose from "mongoose";
import { PostModel, UserModel } from './models/index';

const app = express();

mongoose.connect("mongodb+srv://localhost/")

const authenticationMiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const userId = req.headers.userId;
        if (token !== 1234) {
            throw new Error("Unauthorized user")
        }
        req.userId = userId;
        next();
    } catch (error) { return res.status(500).json({ message: error?.message }) }
}

app.post('/users/login', authenticationMiddleWare, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username, password })
        if (!user) {
            throw new Error("Unauthorized user")
        }
        res.status(200).json({ token: 1234, userId })
    } catch (error) { return res.status(500).json({ message: error?.message }) }
})

app.post('/user', async (req, res) => {
    try {
        const { username, password } = req.body;
        await UserModel.create({
            username,
            password
        })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
    }
})

app.post('/posts', authenticationMiddleWare, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.userId;
        await PostModel({ title, content, user: userId })
    } catch (error) {
        res.status(500).json({ message: "Something wrong happened" })
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
        const posts = await PostModel.find({ user: userId });
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

app.update('/posts/:id', async (req, res) => {
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