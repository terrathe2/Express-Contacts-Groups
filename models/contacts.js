const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Contact {
  constructor(id, name, company, telp_number, email) {
    this.id = id;
    this.name = name;
    this.company = company;
    this.telp_number = telp_number;
    this.email = email;
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * from Contacts", (err, rowsContact)=>{
        if (err) {
          reject(err);
        } else {
          let arrContact = [];
          rowsContact.forEach((rows) => {
            let objCon = new Contact(rows.id, rows.name, rows.company, rows.telp_number, rows.email);
            arrContact.push(objCon);
          });
          resolve(arrContact);
        }
      });
    });
  }

  static findByID(id) {
    return new Promise((resolve, reason) => {
      db.get(`SELECT * from Contacts where id = "${id}"`, (err, rowsContactsbyID)=>{
        if (err) {
          reject(err);
        } else {
          let objCon = new Contact(rowsContactsbyID.id, rowsContactsbyID.name, rowsContactsbyID.company, rowsContactsbyID.telp_number, rowsContactsbyID.email);
          resolve(objCon);
        }
      });
    });
  }

  static insert(req) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Contacts ("name", "company", "telp_number", "email") values ("${req.name}","${req.company}","${req.telp_number}","${req.email}")`,function (err){
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
    	});
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from Contacts where id = "${id}"`, ()=>{

        let deleteObj = {
          id: id
        }

        resolve(deleteObj);
    	});
    });
  }

  static update(req, id) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE Contacts set name='${req.name}', company='${req.company}', telp_number='${req.telp_number}', email='${req.email}' where id ='${id}'`, ()=>{

        let updateObj = {
          id: id,
          name: req.name,
          company: req.company,
          telp_number: req.telp_number,
          email: req.email
        }

        resolve(updateObj);
    	});
    });
  }
}

module.exports = Contact;
