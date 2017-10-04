const express = require("express");
const router = express.Router();
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");
const Group = require("../models/groups");

// -------------------------------------------------------Tampil Halaman Contact
router.get("/contacts", (req, res)=>{
	Promise.all([
		Contact.findAll(),
		ContactGroup.findAll(),
		Group.findAll()
	])
	.then((results) => {
		results[0].forEach((contact) => {
			contact.groupId = [];
			results[1].forEach((contactGroup) => {
				if (contact.id == contactGroup.idContact) {
					contact.groupId.push(contactGroup.idGroup);
				}
			});
		});


		results[0].forEach((contact) => {
			contact.groupName = [];
			contact.groupId.forEach((id) => {
				results[2].forEach((group) => {
					if(id === group.id)
						contact.groupName.push(group.name_of_group);
				})
			})
		})
		res.render("contacts", {dataContacts: results[0], dataGroups: results[2]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Insert Data Contact
router.post("/contacts", (req, res) => {
	Contact.insert(req.body).then((lastId) => {
		return ContactGroup.insert(lastId, req.body.groupID);
	})
	.then(() => {
		res.redirect("/contacts");
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Tampil Edit Contact
router.get("/contacts/edit/:id", (req, res)=>{
	Contact.findByID(req.params.id).then((objCon) => {
		res.render("editContact", {dataContact: objCon});
	}).catch((err) => {
		console.log(err);
	});
});

// ----------------------------------------------------------Delete Data Contact
router.get("/contacts/delete/:id", (req, res)=>{
	Contact.delete(req.params.id).then((deleteObj) => {
		console.log(`Berhasil hapus id ${deleteObj.id}`);
		res.redirect("/contacts");
	});
});

// ----------------------------------------------------------Update Data Contact
router.post("/contacts/edit/:id", (req, res)=>{
	Contact.update(req.body, req.params.id).then((updateObj) => {
		console.log(`Berhasil Ubah name, company, telp_number, email dari id ${updateObj.id} menjadi name = ${updateObj.name}, company = ${updateObj.company}, telp_number = ${updateObj.telp_number}, email = ${updateObj.email}`);
		res.redirect("/contacts");
	});
});

module.exports = router;
