import {Schema, Model} from "mongoose";

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    user: {required: true, ref: 'User'}
})

const PostModel = new Model('Post', postSchema);

export default PostModel;