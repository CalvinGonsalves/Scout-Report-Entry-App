const express = require('express')
const router = express.Router()
const Player = require('../models/player')
const Team = require('../models/team')

router.get('/', async (req, res) => {
    let players
    
    try {
        players = await Player.find().sort({ createdAt: 'desc'}).exec()
       
    } catch {
        players =[]
    }
    res.render('index', { players: players});
})

module.exports = router 