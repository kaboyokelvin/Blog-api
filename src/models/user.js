import {Schema, model} from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String
})

const UserModel = model('User', userSchema);

export default UserModel;