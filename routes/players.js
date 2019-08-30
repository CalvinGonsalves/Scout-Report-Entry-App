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
        res.redirect(`players/${newPlayer.id}`)

   } catch {
        // if (player.playerImage != null) {
        //     removePlayerImage(player.playerImage)

        // }
        renderNewPage(res, player, true) 

   }
})

//Show player route
router.get('/:id', async (req, res) => {
     try {
        const player = await Player.findById(req.params.id).populate('team').exec()
        res.render('players/show', { player: player })
    } catch  {
        
         res.redirect('/')
     }
})

// Edit Player Route
router.get('/:id/edit', async (req,res) => {
    try {
        const player = await Player.findById(req.params.id)
        renderEditPage(res, player)

    } catch {
        res.redirect('/')
    }
})


// Update Player Route
router.put('/:id',  async (req,res) => {

       let player 
    
       try {
            player = await Player.findById(req.params.id)
            player.name = req.body.name
            player.team = req.body.team
            player.position = req.body.position
            player.dob = new Date(req.body.dob)
            player.description = req.body.description

            if ( req.body.plimage != null && req.body.plimage !== '') {
                saveImage(player, req.body.plimage)
            }
            await player.save()
            res.redirect(`/players/${player.id}`)
    
       } catch (e){

        // console.log(e)
            if (player != null){

                renderEditPage(res, player, true) 

            }else {
                redirect('/')
            }
    
       }
    })

//Delete player 
router.delete('/:id', async (req,res) => {
    let player
    
    try {
        player = await Player.findById(req.params.id)
        await player.remove()
        res.redirect('/players')
    } catch (e) {
        console.log(e)
        if (player != null) {
            res.render('players/show', {
                player : player,
                errorMessage: 'Could not delete player'
            })
        } else {
            res.redirect('/')
        }


    }
})    

async function renderNewPage(res, player, hasError = false) {
    renderFormPage(res, player, 'new', hasError)

}
///
async function renderEditPage(res, player, hasError = false) {
   renderFormPage(res, player, 'edit', hasError)
}
///
async function renderFormPage(res, player, form,  hasError = false) {
    try {
        const teams = await Team.find({})
        const params = {
            teams: teams,
            player: player
        }

        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Player'
            }
        }

        
        res.render(`players/${form}`, params)
    } catch {
        res.redirect('/players')
    }
}

// function removePlayerImage(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }



function saveImage(player, plimageEncoded) {
    if (plimageEncoded == null) return

    const image = JSON.parse(plimageEncoded)
    if (image != null && imageMimeTypes.includes(image.type))  {
        player.playerImage = new Buffer.from(image.data, 'base64')
        player.playerImageType = image.type
    }
}


module.exports = router