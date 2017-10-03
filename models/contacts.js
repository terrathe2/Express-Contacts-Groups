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

  static findAll(call) {
    db.all("SELECT * from Contacts", (err, rowsContact)=>{
      let arrContact = [];
      rowsContact.forEach((rows) => {
        let objCon = new Contact(rows.id, rows.name, rows.company, rows.telp_number, rows.email);
        arrContact.push(objCon);
      });
      call(arrContact);
    });
  }

  static findByID(id, call) {
    db.get(`SELECT * from Contacts where id = "${id}"`, (err, rowsContactsbyID)=>{
      let objCon = new Contact(rowsContactsbyID.id, rowsContactsbyID.name, rowsContactsbyID.company, rowsContactsbyID.telp_number, rowsContactsbyID.email);
      call(objCon);
    });
  }

  static insert(req, call) {
    db.run(`INSERT INTO Contacts ("name", "company", "telp_number", "email") values ("${req.name}","${req.company}","${req.telp_number}","${req.email}")`,function (err){
      call(this.lastID);
  	});
  }

  static delete(id, call) {
    db.run(`DELETE from Contacts where id = "${id}"`, ()=>{
      call();
  	});
  }

  static update(req, id, call) {
    db.run(`UPDATE Contacts set name='${req.name}', company='${req.company}', telp_number='${req.telp_number}', email='${req.email}' where id ='${id}'`, ()=>{
      call();
  	});
  }
}

module.exports = Contact;
