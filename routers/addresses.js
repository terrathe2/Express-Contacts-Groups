const express = require("express");
const router = express.Router();
const Address = require("../models/addresses");
const Contact = require("../models/contacts");

// -------------------------------------------------------Tampil Halaman Address
router.get("/addresses", (req, res)=>{
	Promise.all([
		Address.findAll(),
		Contact.findAll()
	])
	.then((results) => {
		results[0].forEach((Address)=>{
			results[1].forEach((contact)=>{
				if (Address.idContact == contact.id) {
					Address.name = contact.name;
				}
			});
		});
		res.render("addresses", {dataContacts: results[1], dataAddresses: results[0]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Insert Data Address
router.post("/addresses", (req, res)=>{
	Address.insert(req.body).then(() => {
		res.redirect("/addresses");
	})
});

// ----------------------------------------------------------Tampil Edit Address
router.get("/addresses/edit/:id", (req, res)=>{
	Promise.all([
		Address.findByID(req.params.id),
		Contact.findAll()
	])
	.then((results) => {
		res.render("editAddresses", {dataAddres: results[0], dataContact: results[1]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Delete Data Address
router.get("/addresses/delete/:id", (req, res)=>{
	Address.delete(req.params).then((deleteObj) => {
		console.log(`Berhasil hapus id ${deleteObj.id}`);
		res.redirect("/addresses");
	});
});

// ----------------------------------------------------------Update Data Address
router.post("/addresses/edit/:id", (req, res)=>{
	Address.update(req.body, req.params).then((updateObj) => {
		console.log(`Berhasil Ubah idContact, street, city, zipcode dari id ${updateObj.id} menjadi idContact = ${updateObj.idContact}, street = ${updateObj.street}, city = ${updateObj.city}, zipcode = ${updateObj.zipcode}`);
		res.redirect("/addresses");
	});
});

module.exports = router;
