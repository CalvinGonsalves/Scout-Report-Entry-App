const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
     },
    position: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    playerImage: {
        type: Buffer,
        required: true
    },
    playerImageType: {
        type: String,
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    }


})

playerSchema.virtual('playerImagePath').get(function() {
    if (this.playerImage != null && this.playerImageType != null) {
        return `data: ${this.coverImageType}; charset=utf-8;base64,
        ${this.playerImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Player', playerSchema)
