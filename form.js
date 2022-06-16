const rjdb = require('./rjdb.js');
const db = rjdb('./db/form.json')

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  if (req.method == "POST") {
    let company = req.params.companyID
    let name = req.body.name
    let auditors = req.body.auditors
    let criterions = req.body.criterions // { "text":"Критерий", "autocomment":"Авто-комментарий если ответ НЕТ", "weight": 100 }

    if (!name || !company) {
      return res
        .status(400)
        .send("Error Name "+name+", Company "+company)
    }
    if (db.get(obj => obj.name == name).data[0]) {
      return res
        .status(409)
        .send("Error "+name+" already exist")
    }

    let id = uuidv4();
    let obj = {"id": id, "name": name, "company": company, "auditors": auditors, "criterions": criterions}
    db.set(obj)

    return res
      .status(200)
      .send(obj)
  }

  if (req.method == "GET") {
    let id = req.params.id
    let company = req.params.companyID
    let obj

    if (!id) {
      if (company) {
        obj = db.get(obj => obj.company == company).data
      } else {
        obj = db.get().data
        obj.forEach((item, i) => {
          obj[i] = {"company": obj[i].company, "id": obj[i].id, "name": obj[i].name}
        });
      }
    } else {
      obj = db.get(obj => obj.id == id).data[0]
    }

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
