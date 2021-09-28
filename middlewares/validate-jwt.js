const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const validateJWT = async( req = request,res = response , next) => {

    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({
            msg: 'Token is missing'
        })
    }

    try {
        
        const { uid } = jwt.verify( token ,process.env.SECRETORPRIVATEKEY)

        // leer usuario q corresponde al uid
        const usuario = await User.findOne({ where: { id: uid } })

        if(!usuario){
            return res.status(401).json({
                msg: 'Token !valido -usuario no existe en DB'
            })
        }
        

        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token invalid'
        })
    }

}


module.exports = {
    validateJWT
}