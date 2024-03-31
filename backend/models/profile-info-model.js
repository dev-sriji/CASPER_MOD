import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    name:String,
    id:String,
    about:String,
    dps:Array,
    type:String
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile