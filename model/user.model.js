import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ['Admin', 'Manager', 'Member'], default: 'Member' },
    organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' }

})  

const  User = mongoose.model("User",UserSchema)

export default User;