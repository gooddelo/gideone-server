const rjdb = require('../rjdb.js');
const DB = rjdb('../db/account.json')
const authCheck = require('../middleware/auth')

const getAll = async (req, res) => {
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

  let obj = DB.get().data

  obj.forEach((item, i) => {
    obj[i] = {"id": obj[i].id, "email": obj[i].email}
  });

  return res
    .status(200)
    .send(obj)
}

const get = async (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (req.userData.id != id) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  let obj = db.get(obj => obj.id == id).data[0]

  if (!obj) {
    return res
      .status(400)
      .send("Error "+id+" undefined in database")
  }

  return res
    .status(200)
    .send(obj)
}

const update = async (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (req.userData.id != id) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  if (!db.get(obj => obj.id == id).data[0]) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }

  db.get(obj => obj.id == id)
    .update(req.body)

  return res
    .status(200)
    .send(db.get(obj => obj.id == id).data[0])
}

const delete = async (req, res) => {
  let id = req.params.id
  let auth = authCheck(req)

  if (!auth) {
    return res
      .status(400)
      .send(req.userData)
  }
  if (req.userData.id != id) {
    if (!req.userData.permissions.includes('admin')) {
      return res
        .status(400)
        .send('Permission denide')
    }
  }

  if (!db.get(obj => obj.id == id).data[0]) {
    return res
      .status(404)
      .send("Error "+id+" undefined")
  }

  db.get(obj => obj.id == id).remove()

  return res
    .status(200)
    .send("Deleted")
}

module.export = { getAll, get, update, delete }
