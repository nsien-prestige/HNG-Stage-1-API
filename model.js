const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        unique: true
    },

    gender: {
        type: String,
        required: true
    },

    gender_probability: {
        type: Number,
        required: true
    },

    sample_size: {
        type: Number,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    age_group: {
        type: String,
        required: true
    },

    country_id: {
        type: String,
        required: true
    },

    country_probability: {
        type: Number,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

module.exports = mongoose.model('Profile', schema)