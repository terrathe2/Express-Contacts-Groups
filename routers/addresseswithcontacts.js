const express = require("express");
const router = express.Router();
const Contact = require("../models/contacts");
const Address = require("../models/addresses");

router.get("/addresses_with_contact/:id", (req, res)=>{
	Promise.all([
		Contact.findByID(req.params.id),
		Address.findAll()
	])
	.then((results) => {
		results[0].street = [];
		results[1].forEach((Address, index) => {
			if (Address.idContact == results[0].id) {
				results[0].street.push(Address.street);
			}

			if (index >= results[1].length - 1) {
				res.render("addressesandcontacts", {dataAddCont: results[0]});
			}
		})
	})
	.catch((reason) => {
		console.log(reason);
	});
});

module.exports = router;
