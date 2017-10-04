const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Profile {
  constructor(id, idContact, username, password) {
    this.id = id;
    this.idContact = idContact;
    this.username = username;
    this.password = password;
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * from Profiles", (err, rowsProfile)=>{
        if (err) {
          reject(err);
        } else {
          let arrProfile = [];
          rowsProfile.forEach((rows) => {
            let objProfile = new Profile(rows.id, rows.idContact, rows.username, rows.password);
            arrProfile.push(objProfile);
          });
          resolve(arrProfile);
        }
      });
    });
  }

  static findByID(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from Profiles where id = "${id}"`, (err, rowsProfilebyID)=>{
        if(err) {
          reject(err);
        } else {
          let objProfile = new Profile(rowsProfilebyID.id, rowsProfilebyID.idContact, rowsProfilebyID.username, rowsProfilebyID.password);
          resolve(objProfile);
        }
      });
    });
  }

  static insert(req) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Profiles ("idContact", "username", "password") values ("${req.idContact}","${req.username}","${req.password}")`, (error, rows)=>{
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
    	});
    });
  }

  static delete(req) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from Profiles where id = "${req.id}"`, ()=>{

        let deleteObj = {
          id:req.id
        }

        resolve(deleteObj);
    	});
    });
  }

  static update(reqBody, reqParams) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE Profiles set username='${reqBody.username}', password='${reqBody.password}' where id ='${reqParams.id}'`, ()=>{

        let updateObj = {
          id: reqParams.id,
          username: reqBody.username,
          password: reqBody.password
        }

        resolve(updateObj);
    	});
    });
  }
}

module.exports = Profile;
