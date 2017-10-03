const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class ContactGroup {
  constructor(id, idContact, idGroup) {
    this.id = id;
    this.idContact = idContact;
    this.idGroup = idGroup;
  }

  static findAll(call) {
    db.all("SELECT * from ContactsGroups", (err, rowsContactGroup)=>{
      let arrConGrp = [];
      rowsContactGroup.forEach((rows) => {
        let objConGrp = new ContactGroup(rows.id, rows.idContact, rows.idGroup);
        arrConGrp.push(objConGrp);
      });
      call(arrConGrp);
    });
  }

  static findByID(id, call) {
    db.get(`SELECT * from ContactsGroups where id = "${id}"`, (err, rowsContactGroupbyID)=>{
      let objConGrp = new ContactGroup(rowsContactGroupbyID.id, rowsContactGroupbyID.idContact, rowsContactGroupbyID.idGroup);
      call(objConGrp);
    });
  }

  static insert(idCon, idGrp, call) {
    db.run(`INSERT INTO ContactsGroups ("idContact", "idGroup") values ('${idCon}', "${idGrp}")`,()=>{
      call();
    });
  }
}

module.exports = ContactGroup;
