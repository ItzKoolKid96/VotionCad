const db = require('../../../functions/db');
const { loadWebconfig } = require('../../../functions');
const WebSocket = require('ws');
const Tokens = require('csrf');
const csrf = new Tokens()

const secret = csrf.secretSync()

async function router(app, opts) {
    const wss = new WebSocket.Server({ server: app.server, path: "/dashboard/leo" });

    app.addHook('preHandler', async (request, reply) => {
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        const currentCharacter = request.session.get('currentCharacter');
        if (!currentCharacter) return reply.redirect('/dashboard');
        const user = await db.getUser(account.email)
        if (!user) return request.destroySession(() => reply.redirect('/login'));
        request.session.set('account', user); // Refresh the session constantly so no updates get missed
        if (currentCharacter.leo != true) return reply.redirect("/dashboard")
        const pass = await db.verifyPassword(account.email, account.password).catch(e => { return request.destroySession(() => reply.redirect('/login')); })
        if (pass === false) return request.destroySession(() => reply.redirect('/login'));
    })

    app.get('/', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        reply.view("./views/leo/leo_dashboard", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token });
    });

    app.get('/ajax', async (request, reply) => {
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        const officers = await db.getAllLEOs()
        reply.send({ data: officers})
    });

    app.get('/search', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        reply.view("./views/leo/leo_character_search", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token });
    });

    app.get('/search/ajax', async (request, reply) => {
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        const characters = await db.getAllCharacters()
        reply.send({ data: characters })
    });

    app.post('/onduty', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const onduty = await db.setOnduty(body.id)
        if (onduty === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/offduty', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const offduty = await db.setOffduty(body.id)
        if (offduty === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/108', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const teneight = await db.set108(body.id)
        if (teneight === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/107', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const tenseven = await db.set107(body.id)
        if (tenseven === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/106', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const tensix = await db.set106(body.id)
        if (tensix === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/1023', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const tentwentythree = await db.set1023(body.id)
        if (tentwentythree === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.post('/1011', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const character = await db.getCharacter(body.id)
        if (!character) return reply.send({ error: notfound })
        if (character.owner != account.username) return reply.send({ error: notowner })
        const teneleven = await db.set1011(body.id)
        if (teneleven === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.get('/person/:id', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        if (!request.params.id) reply.send("Unkown person.")
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        const character = await db.getCharacter(request.params.id)
        const arrests = await db.getArrests(request.params.id)
        const warrants = await db.getWarrants(request.params.id)
        const citations = await db.getCitations(request.params.id)
        reply.view("./views/leo/leo_person_overview", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token, character: character, citations: citations, arrests: arrests, warrants: warrants });
    });

    app.get('/person/:id/arrest', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        if (!request.params.id) reply.send("Unkown person.")
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        const character = await db.getCharacter(request.params.id)
        const penal_codes = await db.getAllPenalCodes()
        reply.view("./views/leo/leo_character_arrest", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token, character: character, penal_codes: penal_codes });
    });

    app.post('/person/:id/arrest', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const currentCharacter = request.session.get('currentCharacter');
        if (currentCharacter.leo != true) return reply.send({ error: notleo })
        const character = await db.getCharacter(request.params.id)
        if (!character) return reply.send({ error: notfound })
        const addArrest = await db.addArrest(request.params.id, body.penal_code, body.penalty, currentCharacter.name)
        if (addArrest === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.get('/person/:id/warrant', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        if (!request.params.id) reply.send("Unkown person.")
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        const character = await db.getCharacter(request.params.id)
        const penal_codes = await db.getAllPenalCodes()
        reply.view("./views/leo/leo_character_warrant", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token, character: character, penal_codes: penal_codes });
    });

    app.post('/person/:id/warrant', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const currentCharacter = request.session.get('currentCharacter');
        if (currentCharacter.leo != true) return reply.send({ error: notleo })
        const character = await db.getCharacter(request.params.id)
        if (!character) return reply.send({ error: notfound })
        const addWarrant = await db.addWarrant(request.params.id, body.penal_code, body.penalty, currentCharacter.name, body.status)
        if (addWarrant === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.get('/person/:id/warrant/:warrant_id', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        if (!request.params.id) reply.send("Unkown person.")
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        const character = await db.getCharacter(request.params.id)
        const penal_codes = await db.getAllPenalCodes()
        const warrant = await db.getWarrant(request.params.warrant_id)
        reply.view("./views/leo/leo_edit_warrant", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token, character: character, penal_codes: penal_codes, warrant: warrant });
    });

    app.post('/person/:id/warrant/:warrant_id', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const currentCharacter = request.session.get('currentCharacter');
        if (currentCharacter.leo != true) return reply.send({ error: notleo })
        const character = await db.getCharacter(request.params.id)
        if (!character) return reply.send({ error: notfound })
        const addWarrant = await db.editWarrantStatus(request.params.warrant_id, body.status)
        if (addWarrant === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    app.get('/person/:id/citation', async (request, reply) => {
        const settings = await db.getSettings()
        const token = csrf.create(secret)
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.redirect('/login'));
        if (!request.params.id) reply.send("Unkown person.")
        const currentCharacter = request.session.get('currentCharacter');
        const characters = await db.getCharacters(account.username);
        const user = await db.getUser(account.email)
        const character = await db.getCharacter(request.params.id)
        const penal_codes = await db.getAllPenalCodes()
        reply.view("./views/leo/leo_character_citation", { settings: settings, user: user, currentCharacter: currentCharacter, characters: characters, csrftoken: token, character: character, penal_codes: penal_codes });
    });

    app.post('/person/:id/citation', async (request, reply) => {
        const body = JSON.parse(request.body);
        const account = request.session.get('account');
        if (!account) return request.destroySession(() => reply.send({ error: invalidsession }));
        const currentCharacter = request.session.get('currentCharacter');
        if (currentCharacter.leo != true) return reply.send({ error: notleo })
        const character = await db.getCharacter(request.params.id)
        if (!character) return reply.send({ error: notfound })
        const addCitation = await db.addCitation(request.params.id, body.penal_code, body.penalty, currentCharacter.name)
        if (addCitation === true) {
            reply.send({ success: true })
        } else {
            reply.send({ success: false })
        }
    });

    wss.on('connection', (ws) => {
        ws.on('message', async function message(data) {
            if (data.toString("utf8") === "UPDATE") {
                wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({"action": "UPDATE"}));
                });
            } else if (JSON.parse(data.toString("utf8")).type === "PANIC") {
                const json = JSON.parse(data.toString("utf8"))
                const officer = await db.getCharacter(json.id)
                if (!officer) ws.close()
                await db.setPanic(json.id)
                wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({ "type": "PANIC", "officer": officer.name, "location": json.location }));
                });
            }
        });
    })
}

module.exports = router;