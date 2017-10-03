const express = require("express");
const router = express.Router();
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");
const Group = require("../models/groups");

router.get("/contacts", (req, res)=>{
	// db.all("SELECT c.id, c.name, c.company, c.telp_number, c.email, g.name_of_group FROM Contacts c JOIN ContactsGroups cg ON c.id = cg.idContact JOIN Groups g ON g.id = cg.idGroup order by c.name", (err, rows)=>{
	Contact.findAll((rowsContact) => {
		ContactGroup.findAll((rowsContactGroup)=>{
			Group.findAll((rowsGroup) => {

				rowsContact.forEach((contact) => {
					contact.groupId = [];
					rowsContactGroup.forEach((contactGroup) => {
						if (contact.id == contactGroup.idContact) {
							contact.groupId.push(contactGroup.idGroup);
						}
					});
				});


				rowsContact.forEach((contact) => {
					contact.groupName = [];
					contact.groupId.forEach((id) => {
						rowsGroup.forEach((group) => {
							if(id === group.id)
								contact.groupName.push(group.name_of_group);
						})
					})
				})
				res.render("contacts", {dataContacts: rowsContact, dataGroups: rowsGroup});
			});
		});
	});
});

router.post("/contacts", (req, res) => {
	Contact.insert(req.body, (lastId) => {
		ContactGroup.insert(lastId, req.body.groupID, () => {
			res.redirect("/contacts");
		});
	});
});

router.get("/contacts/edit/:id", (req, res)=>{
	Contact.findByID(req.params.id, (rowsContactsbyID) => {
		res.render("editContact", {dataContact: rowsContactsbyID});
	});
});

router.get("/contacts/delete/:id", (req, res)=>{
	Contact.delete(req.params.id, (cb)=>{
		res.redirect("/contacts");
	});
});

router.post("/contacts/edit/:id", (req, res)=>{
	Contact.update(req.body, req.params.id, (cb)=>{
		res.redirect("/contacts");
	});
});

module.exports = router;
