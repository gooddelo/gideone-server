const company = require('./company.js');
const staff = require('./staff.js');
const market = require('./market.js');
const form = require('./form.js');
const report = require('./report.js');
const account = require('./account.js');

const express = require('express');
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json());

const port = 80

app.get('/', (req, res) => {
  res.send('API')
})

app.route('/company')
  .get((req, res) => company(req, res))
  .post((req, res) => company(req, res))
app.route('/company/:id')
  .get((req, res) => company(req, res))
  .put((req, res) => company(req, res))
  .delete((req, res) => company(req, res))

app.route('/company/:companyID/staff')
  .get((req, res) => staff(req, res))
  .post((req, res) => staff(req, res))
app.route('/staff/:id')
  .get((req, res) => staff(req, res))
  .put((req, res) => staff(req, res))
  .delete((req, res) => staff(req, res))

app.route('/company/:companyID/market')
  .get((req, res) => market(req, res))
  .post((req, res) => market(req, res))
app.route('/market/:id')
  .get((req, res) => market(req, res))
  .put((req, res) => market(req, res))
  .delete((req, res) => market(req, res))

app.route('/company/:companyID/form')
  .get((req, res) => form(req, res))
  .post((req, res) => form(req, res))
app.route('/form/:id')
  .get((req, res) => form(req, res))
  .put((req, res) => form(req, res))
  .delete((req, res) => form(req, res))

app.route('/company/:companyID/report')
  .get((req, res) => report(req, res))
  .post((req, res) => report(req, res))
app.route('/report/:id')
  .get((req, res) => report(req, res))
  .delete((req, res) => report(req, res))

app.route('/register')
  .post((req, res) => account.register(req, res))
app.route('/login')
  .post((req, res) => account.login(req, res))
app.route('/user')
  .get((req, res) => account.user(req, res))
app.route('/user/:id')
  .get((req, res) => account.user(req, res))
  .put((req, res) => account.user(req, res))
  .delete((req, res) => account.user(req, res))

app.listen(port, () => {
  console.log(`Server satrt on port: ${port}`)
})
