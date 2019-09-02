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
    hitting: {
        type: Number
    },
    power: {
        type: Number
    },
    running: {
        type: Number
    },
    fielding: {
        type: Number
    },
    throwing: {
        type: Number
    },
    fastball: {
        type: Number,
        default: null
    },
    slider: {
        type: Number,
        default: null
    },
    curveball: {
        type: Number,
        default: null
    },
    changeup: {
        type: Number,
        default: null
    },
    cutter: {
        type: Number,
        default: null
    },
    splitter: {
        type: Number,
        default: null
    },
    control: {
        type: Number,
        default: null
    },
    pitcherOverall: {
        type: Number
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
