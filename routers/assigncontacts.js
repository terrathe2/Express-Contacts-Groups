const express = require("express");
const router = express.Router();
const Group = require("../models/groups");
const Contact = require("../models/contacts");
const ContactGroup = require("../models/contactsgroups");

router.get("/assignContact/:id", (req, res)=>{
	Promise.all([
		Group.findByID(req.params.id),
		Contact.findAll()
	])
	.then((results) => {
		res.render("assignContact", {dataGroup: results[0], dataAssign: results[1]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

router.post("/assignContact/:id", (req, res)=>{
	ContactGroup.insert(req.body.contactName, req.params.id).then(() => {
		res.redirect("/groups");
	});
});

module.exports = router;
