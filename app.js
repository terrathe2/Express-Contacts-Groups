const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tugas.db');

const index = require("./routers/index");
const contacts = require("./routers/contacts");
const profiles = require("./routers/profiles");
const groups = require("./routers/groups");
const addresses = require("./routers/addresses");
const addresseswithcontacts = require("./routers/addresseswithcontacts");
const assigncontacts = require("./routers/assigncontacts");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// --------------------------------------------------index.ejs-------------------------------------------//

app.use("/", index);

// --------------------------------------------------contacts.ejs---------------------------------------//

app.use("/", contacts);

//----------------------------------------------------profiles.ejs-----------------------------------------//

app.use("/", profiles);

// --------------------------------------------------groups.ejs----------------------------------------------//

app.use("/", groups);

// ----------------------------------------------------addresses.ejs----------------------------------------//

app.use("/", addresses);

// ---------------------------------------------------addresseswithcontact.js-----------------------------//

app.use("/", addresseswithcontacts);

// --------------------------------------------------assignContact.js------------------------------------//

app.use("/", assigncontacts);

app.listen(2000, function(){
	console.log('I am running on port 2000');
});
