const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {


    constructor() {
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            authPath:       '/disney/auth',
            charactersPath:   '/disney/characters',
            gendersPath:     '/disney/genders',
            moviesPath:     '/disney/movies'
        }
        
        
        //Conectar bd
        this.connectDB()

        //Middlewares                                           
        this.middlewares()
        
        //Rutas de la app

        this.routes()
    }

    async connectDB() {

        await dbConnection()
    }

    middlewares() {

        //CORS
        this.app.use(cors() )

        //Lectura y Parseo del body
        this.app.use( express.json() )
        
        //Directorio publico
        this.app.use( express.static('public') )

        //Fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }))
        
    }

    routes() {

        this.app.use(this.paths.authPath, require('../routes/auth'))
        this.app.use(this.paths.charactersPath , require('../routes/characters'))
        this.app.use(this.paths.gendersPath , require('../routes/gender'))
        this.app.use(this.paths.moviesPath , require('../routes/movies'))
    }

    listen() {
        this.app.listen( this.port , () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}


module.exports = Server