const express = require('express')
const router = express.Router()

const Player = require('../models/player')
const Team = require('../models/team')
const imageMimeTypes = ['image/jpeg', 'image/png']


// All Players Route
router.get('/', async (req, res) => {

    let query = Player.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    } 

    if (req.query.position != null && req.query.position != '') {
        query = query.regex('position', new RegExp(req.query.position, 'i'))
    } 

    try {
        const players = await query.exec()
        res.render('players/index', {
        players: players,
        searchOptions: req.query
        })

    }   catch {
        res.redirect('/')
    }

    
})


//New Players   Route
router.get('/new', async (req,res) => {
    renderNewPage(res, new Player())
})


// Create Player Route
router.post('/',  async (req,res) => {

//    const fileName = req.file != null ? req.file.filename : null
   const player = new Player({
       name: req.body.name,
       team: req.body.team,
       position: req.body.position,
       dob: new Date(req.body.dob),
    //    playerImage: fileName,
       description: req.body.description
   })

   saveImage(player, req.body.plimage)

   try {
        const newPlayer = await player.save()
        // res.redirect(`players/${newPlayer.id}`)
        res.redirect(`players`)

   } catch {
        // if (player.playerImage != null) {
        //     removePlayerImage(player.playerImage)

        // }
        renderNewPage(res, player, true) 

   }
})

// function removePlayerImage(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }

async function renderNewPage(res, player, hasError = false) {
    try {
        const teams = await Team.find({})
        const params = {
            teams: teams,
            player: player
        }

        if (hasError) params.errorMessage = 'Error Creating Player'
        res.render('players/new', params)
    } catch {
        res.redirect('/players')
    }
}


function saveImage(player, plimageEncoded) {
    if (plimageEncoded == null) return

    const image = JSON.parse(plimageEncoded)
    if (image != null && imageMimeTypes.includes(image.type))  {
        player.playerImage = new Buffer.from(image.data, 'base64')
        player.playerImageType = image.type
    }
}


module.exports = router