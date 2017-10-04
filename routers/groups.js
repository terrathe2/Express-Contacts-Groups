const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

// ---------------------------------------------------------Tampil Halaman Group
router.get("/groups", (req, res)=>{
	Promise.all([
		Group.findAll(),
		ContactGroup.findAll(),
		Contact.findAll()
	])
	.then((results) => {
		results[0].forEach((group) => {
			group.contactId = [];
			results[1].forEach((contactGroup) => {
				if (group.id == contactGroup.idGroup) {
					group.contactId.push(contactGroup.idContact);
				}
			});
		});


		results[0].forEach((group) => {
			group.contactName = [];
			group.contactId.forEach((id) => {
				results[2].forEach((contact) => {
					if(id === contact.id) {
						group.contactName.push(contact.name);
					}
				});
			});
		});
		res.render("groups", {dataGroups: results[0]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ------------------------------------------------------------Insert Data Group
router.post("/groups", (req, res)=>{
	Group.insert(req.body).then(() => {
		res.redirect("/groups");
	});
});

// ------------------------------------------------------------Tampil Edit Group
router.get("/groups/edit/:id", (req, res)=>{
	Group.findByID(req.params.id).then((objGrp) => {
		res.render("editGroup", {dataGroup: objGrp});
	}).catch((err) => {
		console.log(err);
	});
});

// ------------------------------------------------------------Delete Data Group
router.get("/groups/delete/:id", (req, res)=>{
	Group.delete(req.params.id).then((deleteObj) => {
		console.log(`Berhasil hapus id ${deleteObj.id}`);
		res.redirect("/groups");
	});
});

// ------------------------------------------------------------Update Data Group
router.post("/groups/edit/:id", (req, res)=>{
	Group.update(req.body, req.params.id).then((updateObj) => {
		console.log(`Berhasil Ubah name_of_group dari id ${updateObj.id} menjadi name_of_group = ${updateObj.name_of_group}`);
		res.redirect("/groups");
	})
});

module.exports = router;
