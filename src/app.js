const express = require('express')
const cors = require('cors');
require('./db/db');

const app = express();


app.use(cors());
app.use(express.json());
app.use(require('./routers/usuarios'));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})