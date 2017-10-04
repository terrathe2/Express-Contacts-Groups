const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Group {
  constructor(id, name_of_group) {
    this.id = id;
    this.name_of_group = name_of_group;
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * from Groups", (err, rowsGroup)=>{
        if (err) {
          reject(err);
        } else {
          let arrGrp = [];
          rowsGroup.forEach((rows) => {
            let objGrp = new Group(rows.id, rows.name_of_group);
            arrGrp.push(objGrp);
          });
          resolve(arrGrp);
        }
      });
    });
  }

  static findByID(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from Groups where id = "${id}"`, (err, rowsGroupbyID)=>{
        if (err) {
          reject(err);
        } else {
          let objGrp = new Group(rowsGroupbyID.id, rowsGroupbyID.name_of_group);
          resolve(objGrp);
        }
      });
    });
  }

  static insert(req) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Groups ("name_of_group") values ("${req.name_of_group}")`, ()=>{
    		resolve();
    	});
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from Groups where id = "${id}"`, ()=>{

        let deleteObj = {
          id: id
        }

        resolve(deleteObj);
    	});
    });
  }

  static update(req, id) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE Groups set name_of_group='${req.name_of_group}' where id ='${id}'`, ()=>{

        let updateObj = {
          id: id,
          name_of_group: req.name_of_group
        }

        resolve(updateObj);
    	});
    });
  }
}

module.exports = Group;
