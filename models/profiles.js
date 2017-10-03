const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Profile {
  constructor(id, idContact, username, password) {
    this.id = id;
    this.idContact = idContact;
    this.username = username;
    this.password = password;
  }

  static findAll(call) {
    db.all("SELECT * from Profiles", (err, rowsProfile)=>{
      let arrProfile = [];
      rowsProfile.forEach((rows) => {
        let objProfile = new Profile(rows.id, rows.idContact, rows.username, rows.password);
        arrProfile.push(objProfile);
      });
      call(arrProfile);
    });
  }

  static findByID(id, call) {
    db.get(`SELECT * from Profiles where id = "${id}"`, (err, rowsProfilebyID)=>{
      let objProfile = new Profile(rowsProfilebyID.id, rowsProfilebyID.idContact, rowsProfilebyID.username, rowsProfilebyID.password);
      call(objProfile);
    });
  }

  static insert(req, call) {
    db.run(`INSERT INTO Profiles ("idContact", "username", "password") values ("${req.idContact}","${req.username}","${req.password}")`, (error)=>{
  		call(error);
  	});
  }

  static delete(req, call) {
    db.run(`DELETE from Profiles where id = "${req.id}"`, ()=>{
      call();
  	});
  }

  static update(reqBody, reqParams, call) {
    db.run(`UPDATE Profiles set username='${reqBody.username}', password='${reqBody.password}' where id ='${reqParams.id}'`, ()=>{
      call();
  	});
  }
}

module.exports = Profile;
