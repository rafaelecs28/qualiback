const jwt = require('jsonwebtoken')
const User = require('../models/Usuario')

const auth = async(req, res, next) => {
    if(req.header('Authorization')){
        var token = req.header('Authorization').replace('Bearer ', '')
        if(token != 'Bearer'){
            var data = jwt.verify(token, process.env.JWT_KEY)
        }
    }
    else{
        return res.send({ error: 'Para executar a tarefa, faça login!' })
    }    
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Sem autorização de acesso.' })
    }

}
module.exports = auth