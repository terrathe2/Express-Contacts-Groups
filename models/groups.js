const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Group {
  constructor(id, name_of_group) {
    this.id = id;
    this.name_of_group = name_of_group;
  }

  static findAll(call) {
    db.all("SELECT * from Groups", (err, rowsGroup)=>{
      let arrGrp = [];
      rowsGroup.forEach((rows) => {
        let objGrp = new Group(rows.id, rows.name_of_group);
        arrGrp.push(objGrp);
      });
      call(arrGrp);
    });
  }

  static findByID(id, call) {
    db.get(`SELECT * from Groups where id = "${id}"`, (err, rowsGroupbyID)=>{
      let objGrp = new Group(rowsGroupbyID.id, rowsGroupbyID.name_of_group);
      call(objGrp);
    });
  }

  static insert(req, call) {
    db.run(`INSERT INTO Groups ("name_of_group") values ("${req.name_of_group}")`, ()=>{
  		call();
  	});
  }

  static delete(req, call) {
    db.run(`DELETE from Groups where id = "${req}"`, ()=>{
      call();
  	});
  }

  static update(req, id, call) {
    db.run(`UPDATE Groups set name_of_group='${req.name_of_group}' where id ='${id}'`, ()=>{
      call();
  	});
  }
}

module.exports = Group;
