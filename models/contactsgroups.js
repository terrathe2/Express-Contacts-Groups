const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class ContactGroup {
  constructor(id, idContact, idGroup) {
    this.id = id;
    this.idContact = idContact;
    this.idGroup = idGroup;
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * from ContactsGroups", (err, rowsContactGroup)=>{
        if (err) {
          reject(err);
        } else {
          let arrConGrp = [];
          rowsContactGroup.forEach((rows) => {
            let objConGrp = new ContactGroup(rows.id, rows.idContact, rows.idGroup);
            arrConGrp.push(objConGrp);
          });
          resolve(arrConGrp);
        }
      });
    });
  }

  static findByID(id, call) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from ContactsGroups where id = "${id}"`, (err, rowsContactGroupbyID)=>{
        if (err) {
          reject(err);
        } else {
          let objConGrp = new ContactGroup(rowsContactGroupbyID.id, rowsContactGroupbyID.idContact, rowsContactGroupbyID.idGroup);
          resolve(objConGrp);
        }
      });
    });
  }

  static insert(idCon, idGrp) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO ContactsGroups ("idContact", "idGroup") values ('${idCon}', "${idGrp}")`,()=>{
        resolve();
      });
    });
  }
}

module.exports = ContactGroup;
