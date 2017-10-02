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
	db.all("SELECT * FROM Contacts", (err, rows)=>{
		res.render("contacts", {dataContacts: rows});
	});
});

app.post("/contacts", (req, res)=>{
	db.run(`INSERT INTO Contacts ("name", "company", "telp_number", "email") values ("${req.body.name}","${req.body.company}","${req.body.telp_number}","${req.body.email}")`,()=>{
		res.redirect("/contacts");
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
	db.all(`SELECT p.id, p.idContact, c.name, p.username, p.password from Profiles p LEFT JOIN Contacts c ON p.idContact = c.id`, (err, rows)=>{
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
	db.all(`SELECT * from Groups`, (err, rows)=>{
		res.render("groups", {dataGroups: rows});
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
	db.all(`SELECT * from Addresses`, (err, rows)=>{
		res.render("addresses", {dataAddresses: rows});
	});
});

app.post("/addresses", (req, res)=>{
	db.run(`INSERT INTO Addresses ("street", "city", "zipcode") values ("${req.body.street}","${req.body.city}","${req.body.zipcode}")`, ()=>{
		res.redirect("/addresses");
	});
});

app.get("/addresses/edit/:id", (req, res)=>{
	db.get(`SELECT * FROM Addresses where id = "${req.params.id}"`, (err, data)=>{
		res.render("editAddresses", {dataAddres: data});
	});
});

app.get("/addresses/delete/:id", (req, res)=>{
	db.run(`DELETE from Addresses where id = "${req.params.id}"`, ()=>{
		res.redirect("/addresses");
	})
});

// ----------------------------------------------------editAddress.ejs-------------------------------------//

app.post("/addresses/edit/:id", (req, res)=>{
	db.run(`UPDATE Addresses set street='${req.body.street}', city='${req.body.city}', zipcode='${req.body.zipcode}' where id ='${req.params.id}'`, ()=>{
		res.redirect("/addresses");
	});
});

app.listen(2000, function(){
	console.log('I am running on port 2000');
});