const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const roles  = ['usuario','gerente','admin'];
const ufs =  ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
/*
Criação do Schema da tabela usuario no mongoose (MongoDB)
* cpf => valor inteiro para o cpf do usuário cadastrado.
* nome => string com o nome do usuário
* email => string com o e-mail do usuário que será utilizado no login.
* telefone => valor inteiro com o telefone do usuário (No banco o número estará por extenso, enquanto no front da aplicação terá máscara e separação)
* endereco => string com endereço do usuário
* uf => string que valida entre as 27 unidades federativas
* createdAt => data de criação de um usuário (pega data e hora atual)
* updatedAt => data de atualização de um usuário (pega data e hora atual)
* role => perfil de acesso do usuário.
* tokens => token de acesso a api. 
*/
const UsuarioSchema = mongoose.Schema({
    cpf: {
        type: Number,
        min: 11111111111,
        max: 99999999999,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlenght: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    telefone: {
        type: Number,
        min: 1111111111,
        max: 9999999999
    },
    endereco: String,
    cep:{
        type: String,
        minlength: 8,
        maxlength: 8
    },
    uf: {
        type: String,
        enum: ufs
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    role:{
        type: String,
        required: true,
        enum:  roles,
        default: roles[0],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Feminino']
    }
})
//Modifica o password para hash antes de salvar no banco. 
UsuarioSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})
//Método que gera automaticamente o token para controle da sessão na aplicação.
UsuarioSchema.methods.gerarToken = async function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_KEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}
//Função para validar as credenciais de acesso do usuário, levando em conta o e-mail e o password.
UsuarioSchema.statics.validarCredenciais = async (email, password) => {

    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', UsuarioSchema)

module.exports = User
