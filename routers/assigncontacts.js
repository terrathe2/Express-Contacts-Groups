const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");

router.get("/assignContact/:id", (req, res)=>{
	Group.findByID(req.params.id, (rowsGroupbyID) => {
		Contact.findAll((rowsContact) => {
			res.render("assignContact", {dataGroup:rowsGroupbyID, dataAssign: rowsContact});
		});
	});
});

router.post("/assignContact/:id", (req, res)=>{
	ContactGroup.insert(req.body.contactName, req.params.id, () => {
		res.redirect("/groups");
	});
});

module.exports = router;
