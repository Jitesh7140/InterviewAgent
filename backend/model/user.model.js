const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        default:100,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;