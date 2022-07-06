const express = require('express');
const account = require('./routes/account')
const user = require('./routes/user')
const company = require('./routes/company')
const data = require('./routes/data')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(cookieParser());

const port = 80

app.get('/', (req, res) => {
  res.send('API')
})

app.use('/register', account.register)
app.use('/login', account.login)
app.use('/user', user)
app.use('/company', company)
app.use('/data', data)

app.listen(port, () => {
  console.log(`Server satrt on port: ${port}`)
})
