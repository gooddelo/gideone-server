process.on('uncaughtException', function (err) {
  // console.error(err);
  console.log("RJDB Error "+err);
});

const {readFileSync, writeFileSync, existsSync, appendFileSync} = require('fs');

const read = (path) => {
  if (!existsSync(path)) {appendFileSync(path, '[]')}

  const result = readFileSync(path, "utf-8");
  return result.length ? JSON.parse(result) : [];
}

const write = (path, data) => {
  writeFileSync(path, JSON.stringify(data), "utf8")
}

const edit = (db, newData) => {
  newData.forEach((kv) => {

    if (!kv[0].includes("$")) {
      db[kv[0]] = kv[1]
    }

    if (kv[0] == "$push") {
      Object.entries(kv[1]).forEach((operator) => {
        if (Array.isArray(db[operator[0]])) {
          if (Array.isArray(operator[1])) {
            operator[1].forEach((value) => {
               db[operator[0]].push(value)
            });
          } else {
            db[operator[0]].push(operator[1])
          }
        }
      });
    }

    if (kv[0] == "$pull") {
      Object.entries(kv[1]).forEach((operator) => {
        if (Array.isArray(db[operator[0]])) {
          db[operator[0]]
            .splice(db[operator[0]].indexOf(operator[1]), 1)
        }
      });
    }

  })

  return db
}

const RapidJsonDataBase = (root) => ({

  get: function(filters) {
    this.db = read(root);
    if (filters) {
      this.data = this.db.filter(filters)
    } else {
      this.data = this.db
    }
    return this
  },

  fill: function(data) {
    write(root, data);
  },

  set: function(data) {
    this.db = read(root);
    this.db.push(data);
    this.data = data
    write(root, this.db);
    return this
  },

  update: function(input) {
    let newData = Object.entries(input)

    this.db.forEach((item, i) => this.data.includes(item) ? this.db[i] = edit(this.db[i], newData) : false)

    write(root, this.db);
    return this
  },

  remove: function() {
    this.db = this.db.filter(i => !this.data.includes(i));
    write(root, this.db);
  },

  clear: () => write(root, [])

});

module.exports = RapidJsonDataBase;
