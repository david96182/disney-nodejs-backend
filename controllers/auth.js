const { response } = require("express");
const { User } = require('../models/user')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req , res = response) => {

    const {email, password} = req.body

    try {
        
        //check if email is in db
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if( !user){
            return res.status(400).json({
                msg: 'User/Pass incorrect - email'
            })
        }


        //check pass
        const validPassword = bcryptjs.compareSync( password, user.password )
        if( !validPassword ){
            return res.status(400).json({
                msg: 'User/Pass incorrect - pass'
            })
        }

        //Generate JWT
        const token = await generarJWT( user.id )


        return res.json({
            email,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Something webt wrong'
        })
    }

}

const register = async(req , res = response) => {

    const {name, email, password} = req.body

    try {

        //check if email already exists
        const isemail = await User.findOne({
            where: {
                email: email
            }
        })
        
        if(isemail != null){
            return res.status(400).json({
                msg: 'There is a user with that email already'
            })
        }
        else{

            //encrypt pass
            const salt = bcryptjs.genSaltSync()
            pass = bcryptjs.hashSync( password,salt)

            
            const user = await User.create({
                name: name,
                email: email,
                password: pass
            })

            return res.status(201).json({
                user
            })
        }

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Something went wrong'
        })
    }
}

module.exports = {
    login,
    register
}
