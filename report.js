const rjdb = require('./rjdb.js');
const db = rjdb('./db/report.json')

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res) => {
  if (req.method == "POST") {
    let company = req.params.companyID
    let data = req.body

    if (!company || !data) {
      return res
        .status(400)
        .send("Error Company "+company+" Data "+data)
    }

    let id = uuidv4();
    let obj = {"id": id, "company": company, "data": data}
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
          obj[i] = {"company": obj[i].company, "id": obj[i].id}
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
