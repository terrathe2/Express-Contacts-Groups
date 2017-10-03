const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

class Address {
  constructor(id, street, city, zipcode, idContact) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.zipcode = zipcode;
    this.idContact = idContact;
  }

  static findAll(call) {
    db.all(`SELECT * from Addresses`, (err, rowsAddressContacts)=>{
      let arrAddress = [];
      rowsAddressContacts.forEach((rows) => {
        let objAdd = new Address(rows.id, rows.street, rows.city, rows.zipcode, rows.idContact);
        arrAddress.push(objAdd);
      });
      call(arrAddress);
  	});
  }

  static findByID(id, call) {
    db.get(`SELECT * from Addresses where id = "${id}"`, (err, rowsAddressesbyID)=>{
      let objAdd = new Address(rowsAddressesbyID.id, rowsAddressesbyID.street, rowsAddressesbyID.city, rowsAddressesbyID.zipcode, rowsAddressesbyID.idContact);
      call(objAdd);
    });
  }

  static insert(req, call) {
    db.run(`INSERT INTO Addresses ("idContact", "street", "city", "zipcode") values ("${req.contactsID}", "${req.street}","${req.city}","${req.zipcode}")`, ()=>{
      call();
  	});
  }

  static delete(req, call) {
    db.run(`DELETE from Addresses where id = "${req.id}"`, ()=>{
  		call();
  	})
  }

  static update(reqBody, reqParams, call) {
    db.run(`UPDATE Addresses set idContact='${reqBody.contactsID}', street='${reqBody.street}', city='${reqBody.city}', zipcode='${reqBody.zipcode}' where id ='${reqParams.id}'`, ()=>{
      call();
  	});
  }
}

module.exports = Address;
