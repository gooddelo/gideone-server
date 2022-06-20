const rjdb = require('./rjdb.js');
const db = rjdb('./db/account.json')

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require('uuid');

const verifyToken = (req, permission) => {
  let output = {}
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return "A token is required for authentication";
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    output.user = decoded;
  } catch (err) {
    return "Invalid Token";
  }

  if (permission) {
    if (!output.user.permissions.includes(permission)) {
      return "Permission denide";
    }
  }

  output.verify = true
  return output;
};

const register = (req, res) => {
  if (req.method == "POST") {
    let {username, password}  = req.body

    if (!(username && password)) {
      return res
        .status(400)
        .send("Error Name undefined")
    }
    if (db.get(obj => obj.username == username).data[0]) {
      return res
        .status(409)
        .send("Error "+username+" already exist")
    }

    let id = uuidv4();
    let ePassword = await bcrypt.hash(password, 10);
    let obj = {"id": id, "username": username, "password": ePassword, "permissions": ["user"]}
    db.set(obj)

    const token = jwt.sign(
          { id: id, username: username, permissions: obj.permissions },
          "TOKEN_KEY",
          {
            expiresIn: "24h",
          }
        );

    return res
      .status(200)
      .send(token)
  }
}

const login = (req, res) => {
  if (req.method == "POST") {
    let {username, password}  = req.body

    if (!(username && password)) {
      return res
        .status(400)
        .send("Error Name undefined")
    }

    let user = db.get(obj => obj.username == username).data[0]

    if (!user) {
      return res
        .status(409)
        .send("Error username or password incorrect")
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res
        .status(409)
        .send("Error username or password incorrect")
    }

    const token = jwt.sign(
          { id: user.id, username: username, permissions: user.permissions },
          "TOKEN_KEY",
          {
            expiresIn: "24h",
          }
        );

    return res
      .status(200)
      .send(token)
  }
}

const user = (req, res) => {
  let auth = verifyToken(req)
  if (auth != true) {
    return res
      .status(400)
      .send(auth)
  }

  if (req.method == "GET") {
    let id = req.params.id

    if (!id) {
      let auth = verifyToken(req, "user.getall")
      if (auth != true) {
        return res
          .status(400)
          .send(auth)
      }

      let obj = db.get().data

      obj.forEach((item, i) => {
        obj[i] = {"id": obj[i].id, "username": obj[i].username}
      });

      return res
        .status(200)
        .send(obj)
    }

    if (auth.user.id != id) {
      return res
        .status(400)
        .send("Permission denide")
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

    if (auth.user.id != id) {
      return res
        .status(400)
        .send("Permission denide")
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

  if (req.method == "DELETE") {
    let id = req.params.id

    if (auth.user.id != id) {
      return res
        .status(400)
        .send("Permission denide")
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
}

module.exports = {register, login, user}
