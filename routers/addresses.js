const express = require("express");
const router = express.Router();
const Address = require("../models/addresses");
const Contact = require("../models/contacts");

router.get("/addresses", (req, res)=>{
	Address.findAll((rowsAddress)=>{
		Contact.findAll((rowsContact)=>{
			rowsAddress.forEach((Address)=>{
				rowsContact.forEach((contact)=>{
					if (Address.idContact == contact.id) {
						Address.name = contact.name;
					}
				});
			});
			res.render("addresses", {dataContacts: rowsContact, dataAddresses: rowsAddress});
		});
  });
});

router.post("/addresses", (req, res)=>{
	Address.insert(req.body, (cb)=>{
		res.redirect("/addresses");
	});
});

router.get("/addresses/edit/:id", (req, res)=>{
	Address.findByID(req.params.id, (rowsAddressesbyID)=>{
		Contact.findAll((rowsContact)=>{
			res.render("editAddresses", {dataAddres: rowsAddressesbyID, dataContact: rowsContact});
		});
	});
});

router.get("/addresses/delete/:id", (req, res)=>{
	Address.delete(req.params, (cb)=>{
		res.redirect("/addresses");
	});
});

router.post("/addresses/edit/:id", (req, res)=>{
	Address.update(req.body, req.params, (cb)=>{
		res.redirect("/addresses");
	});
});

module.exports = router;
