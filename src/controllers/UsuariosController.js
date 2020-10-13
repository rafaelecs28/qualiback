const User = require('../models/Usuario')

module.exports ={
    async  criarUsuario(req, res){
        try {
            const user = new User(req.body)
            await user.save()
            const token = await user.gerarToken()
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    
    async index(req, res){
        try {

            const usuarios = await User.find({role: 'usuario}).sort('nome');

            let lista_usuarios = [];
            for(var x in usuarios){
                lista_usuarios.push({
                    cpf: usuarios[x]['cpf'],
                    nome: usuarios[x]['nome'],
                    email: usuarios[x]['email'],
                    telefone: usuarios[x]['telefone'],
                    endereco: usuarios[x]['endereco'],
                    uf: usuarios[x]['uf'],
                    role: usuarios[x]['role'],
                    sexo: usuarios[x]['sexo'],
                    cep: usuarios[x]['cep'],
                })
            }
            return res.json(lista_usuarios);
        } catch (error) {
            res.status(500).send(error)
        }
    },
    async updateUser(req, res){
        try {
            const usuario = await User.findOneAndUpdate({cpf: req.body.cpf}, { "$set":{nome: req.body.nome, telefone:req.body.telefone, endereco:req.body.endereco, cep:req.body.cep, uf:req.body.uf, sexo:req.body.sexo, role:req.body.role, updateAt: Date.now}})
            res.send(usuario)
        } catch(error){
            res.status(400).send(error)
        }
    },
    async deleteUser(req, res){
        try {
            const usuario = await User.findOneAndRemove({cpf: req.params.cpf})
            res.send(usuario)
        } catch (error) {
            res.status(400).send(error)
        }

    },
    async usuarios(req, res){
        try {
            var usuarios = '';
            if(req.params.role === 'gerente'){
                usuarios = await User.find({role: { "$ne": 'admin' } }).sort('nome');  
            }
            else if(req.params.role  === 'admin'){
                usuarios = await User.find({}).sort('nome');
            }
            else{
                usuarios = await User.find({role: 'usuario' }).sort('nome');
            }
            //const usuarios = await User.find({role: { "$ne": 'admin' } }).sort('nome');
            let lista_usuarios = [];
            for(var x in usuarios){
                lista_usuarios.push({
                    cpf: usuarios[x]['cpf'],
                    nome: usuarios[x]['nome'],
                    email: usuarios[x]['email'],
                    telefone: usuarios[x]['telefone'],
                    endereco: usuarios[x]['endereco'],
                    uf: usuarios[x]['uf'],
                    role: usuarios[x]['role'],
                    sexo: usuarios[x]['sexo'],
                    cep: usuarios[x]['cep'],
                    perfil: usuarios[x]['perfil'],
                })
            }
            return res.json(lista_usuarios);
        } catch (error) {
            res.status(500).send(error)
        }
    }

}
