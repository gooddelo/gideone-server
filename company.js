const rjdb = require('./rjdb.js');
const db = rjdb('./db/company.json')

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  if (req.method == "POST") {
    let name = req.body.name

    if (!name) {
      return res
        .status(400)
        .send("Error Name undefined")
    }
    if (db.get(obj => obj.name == name).data[0]) {
      return res
        .status(409)
        .send("Error "+name+" already exist")
    }

    let id = uuidv4();
    let obj = {"id": id, "name": name}
    db.set(obj)

    return res
      .status(200)
      .send(obj)
  }

  if (req.method == "GET") {
    let id = req.params.id

    if (!id) {
      let obj = db.get().data

      obj.forEach((item, i) => {
        obj[i] = {"id": obj[i].id, "name": obj[i].name}
      });

      return res
        .status(200)
        .send(obj)
    }

    let obj = db.get(obj => obj.id == id).data[0]

    if (!obj) {
      return res
        .status(400)
        .send("Error "+id+" undefined")
    }

    return res
      .status(200)
      .send(obj)
  }

  if (req.method == "PUT") {
    let id = req.params.id

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

  if (req.method == "DELETE") {
    let id = req.params.id

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
}
