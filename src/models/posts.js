import {Schema, model} from "mongoose";

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    user: {type: Schema.Types.ObjectId ,required: true, ref: 'User'}
})

const PostModel = model('Post', postSchema);

export default PostModel;