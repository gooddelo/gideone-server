const rjdb = require('../rjdb.js');
const DB = rjdb('../db/account.json')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
  let {email, password} = req.body

  if (!(email && password)) {
    return res
      .status(400)
      .send("Error Email or Password undefined")
  }
  if (DB.get(obj => obj.email.toLowerCase() == email.toLowerCase()).data[0]) {
    return res
      .status(409)
      .send("Error "+email+" already exist")
  }

  let id = uuidv4();
  let ePassword = await bcrypt.hash(password, 10);
  let obj = {"id": id, "email": email, "password": ePassword, "permissions": ["user"]}
  DB.set(obj)

  const token = jwt.sign({ id: id, email: email, permissions: ["user"] }, "KEY");
  return res
    .cookie("access_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
      sameSite: true,
    })
    .status(200)
    .json({ status: "Registered" });
}

const login = async (req, res) => {
  let {email, password} = req.body

  if (!(email && password)) {
    return res
      .status(400)
      .send("Error email or Password undefined")
  }

  let user = DB.get(obj => obj.email == email).data[0]

  if (!user) {
    return res
      .status(409)
      .send("Error username or password incorrect")
  }

  if (! await bcrypt.compare(password, user.password)) {
    return res
      .status(409)
      .send("Error username or password incorrect")
  }

  const token = jwt.sign({ id: user.id, email: user.email, permissions: user.permissions }, "KEY");
  return res
    .cookie("access_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
      sameSite: true,
    })
    .status(200)
    .json({ status: "Logged" });
}

module.export = { register, login }
