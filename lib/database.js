const { MongoClient } = require('mongodb');
const log = require('./logger');
const functions = require('./functions');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const events = require('./events').eventBus;

const webconfig = functions.loadWebconfig();

let client;
let db;

if (!webconfig.connection_uri) {
	log.error('There is no connection URI set in webconfig.yml. Please set this.').then(() => {
		process.exit(1);
	});
} else {
	client = new MongoClient(webconfig.connection_uri);
	db = client.db(webconfig.database);
}

(async () => {
	await client.connect();
	log.database('Connected to the database.');

	/*
    const collection = db.collection("users");
    const password = "123456";
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            await collection.insertOne({
                username: "jamie",
                email: "volcanomonster07@gmail.com",
                password: hash
            });
        });
    });
    */

	const COLLECTIONS = ['users', 'sessions', 'departments', 'vehicles', 'characters', 'settings', 'penal_code', 'arrests', 'citations', 'warrants'];
	for (const coll of COLLECTIONS) {
		db.listCollections({ name: coll }).next((_, data) => {
			if (!data) {
				db.createCollection(coll, async (err, doc) => {
					if (err) {
						log.error(`There was an error while creating the '${coll}' collection in the database. ` + 'Please make sure that the connection URI is correct and that the user ' + 'has the correct permissions to create collections.');
					} else {
						log.database(`Created the '${coll}' collection.`);
					}
					if (coll === 'settings') {
						await doc.insertOne({
							id: 1,
							name: 'Votion Cad',
							discord: '',
							manualApproval: false,
							aop: "Sandy Shores"
						});
					}
				});
			}
		});
	}
})();

module.exports = {
	getSettings: async function () {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection("settings");
			const res = await collection.find({}).toArray();
			const settings = res[0]
			resolve(settings);
		});
	},
	setAOP: async function (aop) {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection("settings");
			await collection.updateOne({ id: 1 }, { $set: { aop: aop } });
		});
	},
	getUser: async function (email) {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection("users");
			const filteredDocs = await collection.findOne({
				email: email,
			});
			resolve(filteredDocs);
		});
	},
	verifyPassword: async function (email, password) {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection("users");
			const user = await collection.findOne({
				email: email,
			});
			if (!user) resolve(false)
			bcrypt.compare(password, user.password, function (err, result) {
				if (result === true) {
					resolve(true)
				} else {
					resolve(false)
				}
			});
		});
	},
	getCharacters: async function (username) {
		return new Promise(async (resolve, reject) => {
			const collection = db.collection("characters");
			const filteredDocs = await collection.find({ owner: username }).toArray();
			resolve(filteredDocs)
		})
	},
}