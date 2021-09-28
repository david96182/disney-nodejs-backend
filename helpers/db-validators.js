const { Character } = require('../models/character')
const { Gender } = require('../models/gender')
const { Movie } = require('../models/movies')

const existCharacter = async (name) => {
    const charac = await Character.findOne({
        where: {
            name: name
        }
    })
    if(charac){
        throw new Error(`Character ${name} already exits in the DB`)
    }
}

const existGender = async (name) => {
    const gen = await Gender.findOne({
        where: {
            name: name
        }
    })
    if(gen){
        throw new Error(`Gender ${name} already exits in the DB`)
    }
}

const existMovie = async (title) => {
    const mov = await Movie.findOne({
        where: {
            title: title
        }
    })
    if(mov){
        throw new Error(`Movie ${title} already exits in the DB`)
    }
}

const isValidType = (type) => {
    let isvalid = false
    if( type == 'movie' || type == 'serie'){
        isvalid = true
    }
    else {
        throw new Error(`Type ${type} is not valid`)
    }
    return isvalid
}



module.exports = {
    existCharacter,
    existGender,
    existMovie,
    isValidType
}