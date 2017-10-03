const express = require("express");
const router = express.Router();
const Profile = require("../models/profiles");
const Contact = require("../models/contacts");

router.get("/profiles", (req, res)=>{
	Profile.findAll((rowsProfile)=>{
		Contact.findAll((rowsContact)=>{
			rowsProfile.forEach((profile)=>{
				rowsContact.forEach((contact)=>{
					if (profile.idContact == contact.id) {
						profile.name = contact.name;
					}
				});
			});
			res.render("profiles", {dataContacts: rowsContact, dataProfiles: rowsProfile, errorLog:null});
		});
  });
});

router.post("/profiles", (req, res)=>{
  Profile.insert(req.body, (error)=>{
		if (error) {
			Profile.findAll((rowsProfile)=>{
				Contact.findAll((rowsContact)=>{
					rowsProfile.forEach((profile)=>{
						rowsContact.forEach((contact)=>{
							if (profile.idContact == contact.id) {
								profile.name = contact.name;
							}
						});
					});
					res.render("profiles", {dataContacts: rowsContact, dataProfiles: rowsProfile, errorLog:error});
				});
		  });
		} else {
				res.redirect("/profiles");
		}
  });
});

router.get("/profiles/edit/:id/:idContact", (req, res)=>{
	Profile.findByID(req.params.id, (rowsProfilebyID)=>{
		Contact.findByID(req.params.idContact, (rowsContactsbyID)=>{
			res.render("editProfile", {dataProfile: rowsProfilebyID, dataContact: rowsContactsbyID});
		});
	});
});

router.get("/profiles/delete/:id", (req, res)=>{
	Profile.delete(req.params, (cb)=>{
		res.redirect("/profiles");
	});
});

router.post("/profiles/edit/:id", (req, res)=>{
	Profile.update(req.body, req.params, (cb)=>{
		res.redirect("/profiles");
	});
});

module.exports = router;
