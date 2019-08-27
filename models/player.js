const mongoose = require('mongoose')
const path = require('path')
const playerImageBasePath = 'uploads/playerImages'

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
    if (this.playerImage != null) {
        return path.join('/', playerImageBasePath, this.playerImage)
    }
})

module.exports = mongoose.model('Player', playerSchema)
module.exports.playerImageBasePath = playerImageBasePath