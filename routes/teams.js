const express = require('express')
const router = express.Router()
const Team = require('../models/team')
const Player = require('../models/player')

// All Teams Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const teams = await Team.find(searchOptions)
        res.render('teams/index', { 
            teams: teams,
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }

})


//New Teams Route
router.get('/new', (req,res) => {
    res.render('teams/new', { team: new Team()})
})


// Create Team Route
router.post('/', async (req,res) => {
    const team = new Team({
        name: req.body.name
    })
    try {
        const newTeam = await team.save()
        res.redirect(`teams/${newTeam.id}`)
        // res.redirect(`teams`)
    } catch {
        res.render('teams/new', {
            team: team,
            errorMessage: 'Error Creating Team'
        })
    }
    
})

router.get('/:id', async (req,res) => {
    try {
        const team = await Team.findById(req.params.id)
        const players = await Player.find({ team: team.id }).exec()
        res.render('teams/show', {
            team: team,
            playersInTeam: players
        })

    } catch  {
        console.log(e)
        res.redirect('/')
    }

})




module.exports = router