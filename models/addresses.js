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

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * from Addresses`, (err, rowsAddressContacts)=>{
        if (err) {
          reject(err);
        } else {
          let arrAddress = [];
          rowsAddressContacts.forEach((rows) => {
            let objAdd = new Address(rows.id, rows.street, rows.city, rows.zipcode, rows.idContact);
            arrAddress.push(objAdd);
          });
          resolve(arrAddress);
        }
    	});
    });
  }

  static findByID(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * from Addresses where id = "${id}"`, (err, rowsAddressesbyID)=>{
        if (err) {
          reject(err);
        } else {
          let objAdd = new Address(rowsAddressesbyID.id, rowsAddressesbyID.street, rowsAddressesbyID.city, rowsAddressesbyID.zipcode, rowsAddressesbyID.idContact);
          resolve(objAdd);
        }
      });
    });
  }

  static insert(req) {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Addresses ("idContact", "street", "city", "zipcode") values ("${req.contactsID}", "${req.street}","${req.city}","${req.zipcode}")`, ()=>{
        resolve();
    	});
    });
  }

  static delete(req) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE from Addresses where id = "${req.id}"`, ()=>{

        let deleteObj = {
          id:req.id
        }

    		resolve(deleteObj);
    	})
    });
  }

  static update(reqBody, reqParams) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE Addresses set idContact='${reqBody.contactsID}', street='${reqBody.street}', city='${reqBody.city}', zipcode='${reqBody.zipcode}' where id ='${reqParams.id}'`, ()=>{

        let updateObj = {
          id: reqParams.id,
          idContact: reqBody.contactsID,
          street: reqBody.street,
          city: reqBody.city,
          zipcode: reqBody.zipcode
        }

        resolve(updateObj);
    	});
    });
  }
}

module.exports = Address;
