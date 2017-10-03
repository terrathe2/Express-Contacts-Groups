var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./tugas.db');

db.serialize(()=>{
	db.run("CREATE TABLE IF NOT EXISTS Contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, company TEXT, telp_number TEXT, email TEXT)",(err)=>{
		if (err) {
			console.log(err);
		} else {
			console.log("Berhasil buat table Contacts");
		}
	});

	db.run("CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT,idContact REFERENCES Contacts(id), username TEXT UNIQUE, password TEXT)", (err)=>{
		if (err) {
			console.log(err);
		} else {
			console.log("Berhasil buat table Profiles");
		}
	});

	db.run("CREATE TABLE IF NOT EXISTS Groups(id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_group TEXT)", (err)=>{
		if (err) {
			console.log(err);
		} else {
			console.log("Berhasil buat table Groups");
		}
	});

	db.run("CREATE TABLE IF NOT EXISTS Addresses(id INTEGER PRIMARY KEY AUTOINCREMENT, street TEXT, city TEXT, zipcode INTEGER)", (err)=>{
		if (err) {
			console.log(err);
		} else {
			console.log("Berhasil buat table Addresses");
		}
	});

	db.run("CREATE TABLE IF NOT EXISTS ContactsGroups(id INTEGER PRIMARY KEY AUTOINCREMENT, idContact INTEGER REFERENCES Contacts(id) ON DELETE CASCADE, idGroup INTEGER REFERENCES Groups(id) ON DELETE CASCADE)", (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Berhasil buat table many to many");
		}
	})

	// db.run("CREATE UNIQUE INDEX u_idContact on Profiles(idContact)", (err)=>{
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		console.log("Berhasil Add Unique");
	// 	}
	// });
	//
	// db.run("ALTER TABLE Addresses ADD COLUMN idContact INTEGER REFERENCES Contacts(id)", (err) => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		console.log("Berhasil Add Column idContact");
	// 	}
	// })
});
