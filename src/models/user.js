import {Schema, Model} from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String
})

const UserModel = new Model('User', userSchema);

export default UserModel;