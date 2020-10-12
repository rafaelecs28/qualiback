const User = require('../models/Usuario')

module.exports = {
    async login(req, res){
        try {
            const { email, password } = req.body
            console.log(password)
            const user = await User.validarCredenciais(email, password)
            if (!user) {
                return res.status(401).send({error: 'Erro no login, as credenciais estão erradas.'})
            }
            const token = await user.gerarToken()
            res.send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    async logout(req, res){
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token
            })
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    },
    async logoutAll(req, res){
        try {
            req.user.tokens.splice(0, req.user.tokens.length)
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    }
}