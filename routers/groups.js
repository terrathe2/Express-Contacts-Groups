const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

router.get("/groups", (req, res)=>{
	Group.findAll((rowsGroup) => {
		ContactGroup.findAll((rowsContactGroup)=>{
			Contact.findAll((rowsContact) => {

				rowsGroup.forEach((group) => {
					group.contactId = [];
					rowsContactGroup.forEach((contactGroup) => {
						if (group.id == contactGroup.idGroup) {
							group.contactId.push(contactGroup.idContact);
						}
					});
				});


				rowsGroup.forEach((group) => {
					group.contactName = [];
					group.contactId.forEach((id) => {
						rowsContact.forEach((contact) => {
							if(id === contact.id) {
								group.contactName.push(contact.name);
							}
						});
					});
				});
				res.render("groups", {dataGroups: rowsGroup});
			});
		});
	});
});

router.post("/groups", (req, res)=>{
	Group.insert(req.body, () => {
		res.redirect("/groups");
	});
});

router.get("/groups/edit/:id", (req, res)=>{
	Group.findByID(req.params.id, (rowsGroupbyID) => {
		res.render("editGroup", {dataGroup: rowsGroupbyID});
	});
});

router.get("/groups/delete/:id", (req, res)=>{
	Group.delete(req.params.id, () => {
		res.redirect("/groups");
	});
});

router.post("/groups/edit/:id", (req, res)=>{
	Group.update(req.body, req.params.id, () => {
		res.redirect("/groups");
	});
});

module.exports = router;
