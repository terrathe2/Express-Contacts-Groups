const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// --------------------------------------------------index.ejs-------------------------------------------//
app.get("/", function(req, res) {
	res.render("index");
})

// --------------------------------------------------contacts.ejs---------------------------------------//
app.get("/contacts", (req, res)=>{
	db.all("SELECT c.id, c.name, c.company, c.telp_number, c.email, g.name_of_group FROM Contacts c JOIN ContactsGroups cg ON c.id = cg.idContact JOIN Groups g ON g.id = cg.idGroup order by c.name", (err, rows)=>{
		for (let i = 0; i < rows.length-1; i++){
			if (rows[i].name == rows[i+1].name) {
				rows[i+1].name_of_group += ", "+rows[i].name_of_group;
				rows.splice(i,1);
				i--;
			}
		}
		db.all("SELECT * FROM Groups", (err, rowsGroup)=>{
				res.render("contacts", {dataContacts: rows, dataGroups: rowsGroup});
		});
	});
});

app.post("/contacts", (req, res)=>{
	db.run(`INSERT INTO Contacts ("name", "company", "telp_number", "email") values ("${req.body.name}","${req.body.company}","${req.body.telp_number}","${req.body.email}")`,function (err){
		db.run(`INSERT INTO ContactsGroups ("idContact", "idGroup") values ('${this.lastID}', "${req.body.groupID}")`,()=>{
			res.redirect("/contacts");
		});
	});
});

app.get("/contacts/edit/:id", (req, res)=>{
	db.get(`SELECT * FROM Contacts where id = "${req.params.id}"`, (err, data)=>{
		res.render("editContact", {dataContact: data});
	});
});

app.get("/contacts/delete/:id", (req, res)=>{
	db.run(`DELETE from Contacts where id = "${req.params.id}"`, ()=>{
		res.redirect("/contacts");
	})
});

// --------------------------------------------------editcontact.ejs------------------------------------------//

app.post("/contacts/edit/:id", (req, res)=>{
	db.run(`UPDATE Contacts set name='${req.body.name}', company='${req.body.company}', telp_number='${req.body.telp_number}', email='${req.body.email}' where id ='${req.params.id}'`, ()=>{
		res.redirect("/contacts");
	});
});

//----------------------------------------------------profiles.ejs-----------------------------------------//

app.get("/profiles", (req, res)=>{
	db.all("SELECT p.id, p.idContact, c.name, p.username, p.password from Profiles p LEFT JOIN Contacts c ON p.idContact = c.id", (err, rows)=>{
		db.all("SELECT * FROM Contacts", (err, rowsContact)=>{
			res.render("profiles", {dataContacts: rowsContact, dataProfiles: rows, errorLog:null});
		});
	});
});

app.post("/profiles", (req, res)=>{
	db.run(`INSERT INTO Profiles ("idContact", "username", "password") values ("${req.body.idContact}","${req.body.username}","${req.body.password}")`, (error)=>{
		if (error) {
			db.all(`SELECT p.id, p.idContact, c.name, p.username, p.password from Profiles p LEFT JOIN Contacts c ON p.idContact = c.id`, (err, rows)=>{
				db.all("SELECT * FROM Contacts", (err, rowsContact)=>{
					res.render("profiles",  {dataContacts: rowsContact, dataProfiles: rows, errorLog: error});
				});
			});
		} else {
			res.redirect("/profiles");
		}
	});
});

app.get("/profiles/edit/:id/:idContact", (req, res)=>{
	db.get(`SELECT * FROM Profiles where id = "${req.params.id}"`, (err, data)=>{
		db.get(`SELECT * FROM Contacts where id = "${req.params.idContact}"`, (err, nameContact)=>{
			res.render("editProfile", {dataProfile: data, dataContact: nameContact});
		});
	});
});

app.get("/profiles/delete/:id", (req, res)=>{
	db.run(`DELETE from Profiles where id = "${req.params.id}"`, ()=>{
		res.redirect("/profiles");
	})
});

// ---------------------------------------------------editProfile.ejs--------------------------------------//

app.post("/profiles/edit/:id", (req, res)=>{
	db.run(`UPDATE Profiles set username='${req.body.username}', password='${req.body.password}' where id ='${req.params.id}'`, ()=>{
		res.redirect("/profiles");
	});
});

// --------------------------------------------------groups.ejs----------------------------------------------//

app.get("/groups", (req, res)=>{
	db.all("SELECT g.id, g.name_of_group, c.name FROM Groups g JOIN ContactsGroups cg ON g.id = cg.idGroup JOIN Contacts c ON c.id = cg.idContact order by g.name_of_group", (err, groups)=>{
		for (let i = 0; i < groups.length-1; i++){
			if (groups[i].name_of_group == groups[i+1].name_of_group) {
				groups[i+1].name += ", "+groups[i].name;
				groups.splice(i,1);
				i--;
			}
		}
		console.log(groups);
		db.all(`SELECT * from Groups`, (err, rows)=>{
			res.render("groups", {dataGroups: rows, dataContacts: groups});
		});
	});
});

app.post("/groups", (req, res)=>{
	db.run(`INSERT INTO Groups ("name_of_group") values ("${req.body.name_of_group}")`, ()=>{
		res.redirect("/groups");
	});
});

app.get("/groups/edit/:id", (req, res)=>{
	db.get(`SELECT * FROM Groups where id = "${req.params.id}"`, (err, data)=>{
		res.render("editGroup", {dataGroup: data});
	});
});

app.get("/groups/delete/:id", (req, res)=>{
	db.run(`DELETE from Groups where id = "${req.params.id}"`, ()=>{
		res.redirect("/groups");
	})
});

//----------------------------------------------------editGroup.ejs-----------------------------------------//

app.post("/groups/edit/:id", (req, res)=>{
	db.run(`UPDATE Groups set name_of_group='${req.body.name_of_group}' where id ='${req.params.id}'`, ()=>{
		res.redirect("/groups");
	});
});


// ----------------------------------------------------addresses.ejs----------------------------------------//

app.get("/addresses", (req, res)=>{
	db.all(`SELECT a.id, c.name, a.street, a.city, a.zipcode from Addresses a JOIN Contacts c ON a.idContact = c.id`, (err, rows)=>{
		db.all(`SELECT * FROM Contacts`, (err, contactName)=>{
				res.render("addresses", {dataAddresses: rows, dataContacts: contactName});
		});
	});
});

app.post("/addresses", (req, res)=>{
	db.run(`INSERT INTO Addresses ("idContact", "street", "city", "zipcode") values ("${req.body.contactsID}", "${req.body.street}","${req.body.city}","${req.body.zipcode}")`, ()=>{
		res.redirect("/addresses");
	});
});

app.get("/addresses/edit/:id", (req, res)=>{
	db.get(`SELECT * FROM Addresses where id = "${req.params.id}"`, (err, data)=>{
		db.all(`SELECT * FROM Contacts`, (err, contacts)=>{
			console.log(data);
			res.render("editAddresses", {dataAddres: data, dataContact: contacts});
		})
	});
});

app.get("/addresses/delete/:id", (req, res)=>{
	db.run(`DELETE from Addresses where id = "${req.params.id}"`, ()=>{
		res.redirect("/addresses");
	})
});

// ----------------------------------------------------editAddress.ejs-------------------------------------//

app.post("/addresses/edit/:id", (req, res)=>{
	db.run(`UPDATE Addresses set idContact='${req.body.contactsID}', street='${req.body.street}', city='${req.body.city}', zipcode='${req.body.zipcode}' where id ='${req.params.id}'`, ()=>{
		res.redirect("/addresses");
	});
});

// ---------------------------------------------------addresseswithcontact.js-----------------------------//

app.get("/addresses_with_contact/:id", (req, res)=>{
	db.get(`SELECT * from Contacts where id = '${req.params.id}'`, (err, rows)=>{
		db.all(`SELECT * from Addresses where idContact = '${req.params.id}'`, (err, rowsAddress)=>{
			res.render("addressesandcontacts", {dataAddCont: rows, dataAdd: rowsAddress});
		})
	});
});

// --------------------------------------------------assignContact.js------------------------------------//

app.get("/assignContact/:id", (req, res)=>{
	db.get(`SELECT * from Groups where id = "${req.params.id}"`, (err, idGroup)=>{
		db.all("SELECT * from Contacts order by name", (err, rowsContact)=>{
			for (let i = 0; i < rowsContact.length-1; i++) {
				if (rowsContact[i].name == rowsContact[i+1].name) {
					rowsContact.splice(i, 1);
					i--;
				}
			}
			res.render("assignContact", {dataGroup:idGroup, dataAssign: rowsContact});
		});
	});
});

app.post("/assignContact/:id", (req, res)=>{
	db.get(`SELECT * from Contacts where id = "${req.body.contactName}"`, (err, contactId)=>{
		db.run(`INSERT INTO Contacts ("name", "company", "telp_number", "email") values ("${contactId.name}","${contactId.company}","${contactId.telp_number}","${contactId.email}")`,function (err){
			db.run(`INSERT INTO ContactsGroups ("idContact", "idGroup") values ('${this.lastID}', "${req.params.id}")`,()=>{
				res.redirect("/groups");
			});
		});
	});
});

app.listen(2000, function(){
	console.log('I am running on port 2000');
});
