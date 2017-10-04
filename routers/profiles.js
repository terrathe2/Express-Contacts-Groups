const express = require("express");
const router = express.Router();
const Profile = require("../models/profiles");
const Contact = require("../models/contacts");

// -------------------------------------------------------Tampil Halaman Profile
router.get("/profiles", (req, res)=>{
	Promise.all([
		Profile.findAll(),
		Contact.findAll()
	])
	.then((results) => {
		results[0].forEach((profile)=>{
			results[1].forEach((contact)=>{
				if (profile.idContact == contact.id) {
					profile.name = contact.name;
				}
			});
		});
		res.render("profiles", {dataContacts: results[1], dataProfiles: results[0], errorLog:null});
	})
	.catch(reason => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Insert Data Profile
router.post("/profiles", (req, res)=>{
	Profile.insert(req.body).then((rows) => {
		res.redirect("/profiles");
	}).catch((error) => {
		Promise.all([
			Profile.findAll(),
			Contact.findAll()
		])
		.then((results) => {
			results[0].forEach((profile)=>{
				results[1].forEach((contact)=>{
					if (profile.idContact == contact.id) {
						profile.name = contact.name;
					}
				});
			});
			res.render("profiles", {dataContacts: results[1], dataProfiles: results[0], errorLog:error});
		})
		.catch(reason => {
			console.log(reason);
		});
	});
});

// ----------------------------------------------------------Tampil Edit Profile
router.get("/profiles/edit/:id/:idContact", (req, res)=>{
	Promise.all([
		Profile.findByID(req.params.id),
		Contact.findByID(req.params.idContact)
	])
	.then((results) => {
		res.render("editProfile", {dataProfile: results[0], dataContact: results[1]});
	})
	.catch((reason) => {
		console.log(reason);
	});
});

// ----------------------------------------------------------Delete Data Profile
router.get("/profiles/delete/:id", (req, res)=>{
	Profile.delete(req.params).then((deleteObj) => {
		console.log(`Berhasil Hapus id ${deleteObj.id}`);
		res.redirect("/profiles");
	});
});

// ----------------------------------------------------------Update Data Profile
router.post("/profiles/edit/:id", (req, res)=>{
	Profile.update(req.body, req.params).then((updateObj) => {
		console.log(`Berhasil Ubah username & password id ${updateObj.id} menjadi username = ${updateObj.username}, password = ${updateObj.password}`);
		res.redirect("/profiles");
	});
});

module.exports = router;
