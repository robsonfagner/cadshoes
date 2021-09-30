const express = require('express')
var bodyParser = require('body-parser')
const connectDB = require('./config/db');


var cors = require('cors')
const app = express()
const PORT = 3001
// Init Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Connect Database
connectDB()


app.use('/', require('./routes/hello'))
app.use('/user', require('./routes/api/user'))
app.use('/auth', require('./routes/api/auth'))


app.listen(PORT, () => { console.log(`port ${PORT}`) })


