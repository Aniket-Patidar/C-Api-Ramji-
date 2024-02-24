const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        min: [3, "min 3 characters required"],
        unique: [true, "username all ready exist"],
        required: [true, "username required"],
        trim: true,
    },
    name: String,
    city: String,
    password: String,
    profileImage: String,
    contact: {
        type: String,
        unique: [true, "contact all ready exist"],
        min: [10, "contact must be at least 10"],
        max: [10, "contact must be at least 10"],
        required: [true, "contact required"],
    },
    currCount: {
        type: Number,
        default: "0"
    },
    totalCount: {
        type: Number,
        default: "0"
    },
    rank: {
        type: Number,
        default: "108"
    },
    dailyCounts: [
        {
            date: { type: Date },
            count: { type: Number, default: 0 },
        },
    ],
    mala: {
        type: Number,
        default: "0"
    },
    role: {
        type: String,
        default: 'user'
    },
    joiningDate: {
        type: Date,
        default: Date.now // Set the default value to the current date
    }
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};


module.exports = mongoose.model("user", userSchema);