import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema({
    name:String,
    inviteCode: { type: String, required: true, unique: true }
})

const Organisation = mongoose.model("Organisation",OrganisationSchema)

export default Organisation;