const express = require("express");
const router = express.Router();
const Contact = require("../models/contacts");
const Address = require("../models/addresses");

router.get("/addresses_with_contact/:id", (req, res)=>{
	Contact.findByID(req.params.id, (rowsContactsbyID) => {
		Address.findAll((rowsAddressContacts) => {
			rowsContactsbyID.street = [];
			rowsAddressContacts.forEach((Address, index) => {
				if (Address.idContact == rowsContactsbyID.id) {
					rowsContactsbyID.street.push(Address.street);
				}

				if (index >= rowsAddressContacts.length - 1) {
					res.render("addressesandcontacts", {dataAddCont: rowsContactsbyID});
				}
			});
		});
	});
});

module.exports = router;
