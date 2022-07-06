const rjdb = require('./rjdb.js');
const authCheck = require('../middleware/auth')
const { v4: uuidv4 } = require('uuid');

const typeCheck = (type) => {
  if (['staff', 'market', 'form', 'report'].includes(type)) {
    return type
  }
  return false
}

const create = (req, res) => {
  let company = req.params.company
  let type = typeCheck(req.body.type)
  let data = req.body.data
  let auth = authCheck(req)
  let DB = rjdb('./db/'+type+'.json')

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    if (!req.userData.permissions.includes('manager.'+company)) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }
  if (!company || !data || !type) {
    return res
      .status(400)
      .send("Error Company "+company+" Data "+data+" Type "+type)
  }

  let id = uuidv4();
  let obj = {"id": id, "company": company, "data": data}
  DB.set(obj)

  return res
    .status(200)
    .send(obj)
}

const get = (req, res) => {
  let id = req.params.id
  let company = req.params.company
  let type = typeCheck(req.body.type)
  let auth = authCheck(req)
  let DB = rjdb('./db/'+type+'.json')

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    if (!req.userData.permissions.includes('manager.'+company)) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }
  if (!company || !type) {
    return res
      .status(400)
      .send("Error Company "+company+" Type "+type)
  }

  if (!id) {
    let obj = DB.get(obj => obj.company == company).data

    obj.forEach((item, i) => {
      obj[i] = {"id": obj[i].id, "data": obj[i].data}
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
  if (obj.company != company) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  return res
    .status(200)
    .send(obj)
}

const update = (req, res) => {
  let id = req.params.id
  let company = req.params.company
  let type = typeCheck(req.body.type)
  let data = req.body.data
  let auth = authCheck(req)
  let DB = rjdb('./db/'+type+'.json')

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    if (!req.userData.permissions.includes('manager.'+company)) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }
  if (!company || !data || !type) {
    return res
      .status(400)
      .send("Error Company "+company+" Data "+data+" Type "+type)
  }

  let obj = DB.get(obj => obj.id == id).data[0]

  if (!obj) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }
  if (obj.company != company) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  DB.get(obj => obj.id == id)
    .update(data)

  return res
    .status(200)
    .send(DB.get(obj => obj.id == id).data[0])
}

const delete = (req, res) => {
  let id = req.params.id
  let company = req.params.company
  let type = typeCheck(req.body.type)
  let auth = authCheck(req)
  let DB = rjdb('./db/'+type+'.json')

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (!req.userData.permissions.includes('admin')) {
    if (!req.userData.permissions.includes('manager.'+company)) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }
  if (!company || !type) {
    return res
      .status(400)
      .send("Error Company "+company+" Type "+type)
  }

  let obj = DB.get(obj => obj.id == id).data[0]

  if (!obj) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }
  if (obj.company != company) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  DB.get(obj => obj.id == id).remove()

  return res
    .status(200)
    .send("Deleted")
}

module.exports = { create, get, update, delete };
