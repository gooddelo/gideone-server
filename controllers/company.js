const rjdb = require('./rjdb.js');
const DB = rjdb('./db/company.json')
const authCheck = require('../middleware/auth')
const { v4: uuidv4 } = require('uuid');

const create = (req, res) => {
  let name = req.body.name
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    return res
      .status(400)
      .send('Permission denide')
  }
  if (!name) {
    return res
      .status(400)
      .send("Error Name undefined")
  }
  if (DB.get(obj => obj.name == name).data[0]) {
    return res
      .status(409)
      .send("Error "+name+" already exist")
  }

  let id = uuidv4();
  let obj = {"id": id, "name": name}
  DB.set(obj)

  return res
    .status(200)
    .send(obj)
}

const get = (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    return res
      .status(400)
      .send('Permission denide')
  }
  if (!id) {
    let obj = DB.get().data

    obj.forEach((item, i) => {
      obj[i] = {"id": obj[i].id, "name": obj[i].name}
    });

    return res
      .status(200)
      .send(obj)
  }

  let obj = DB.get(obj => obj.id == id).data[0]

  if (!obj) {
    return res
      .status(400)
      .send("Error "+id+" undefined")
  }

  return res
    .status(200)
    .send(obj)
}

const update = (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    return res
      .status(400)
      .send('Permission denide')
  }
  if (!DB.get(obj => obj.id == id).data[0]) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }

  DB.get(obj => obj.id == id)
    .update(req.body)

  return res
    .status(200)
    .send(DB.get(obj => obj.id == id).data[0])
}

const delete = (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    return res
      .status(400)
      .send('Permission denide')
  }
  if (!DB.get(obj => obj.id == id).data[0]) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }

  DB.get(obj => obj.id == id).remove()

  return res
    .status(200)
    .send("Deleted")
}

module.exports = { create, get, update, delete };
