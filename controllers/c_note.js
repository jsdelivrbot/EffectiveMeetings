// create note
function createNote(req, res) {
    const pool = require('../pool.js');
    
    console.log(req.query)

    var query = 'INSERT INTO note (person_id, title, creationDate, content) ' +
        'VALUES ((SELECT id FROM person WHERE username = $1), $2, CURRENT_DATE, $3);';
    var username = req.query.username;
    var title = req.query.title;
    var content = req.query.content;
    pool.query(query, [username, title, content], function(err, res2) {
        if (err) {
            console.log("error creating note");
            console.log(err.stack)
        } else {
            if (res2.rowCount == 1) {
                console.log(username + " created a note");
                res.statusCode = 201;
                res.end('Created note');
            }
        }
    })
}

// get all notes for user
function getNotes(req, res) {
    const pool = require('../pool.js');

    var query = 'SELECT * FROM note WHERE person_id = (SELECT id FROM person WHERE username = $1)';
    var username = req.query.username;
    pool.query(query, [username], function(err, res2) {
        if (err) {
            console.log(err.stack)
        } else {
            res.statusCode = 200;
            res.json(res2.rows)
        }
    })
}

// get a single note
function getSingleNote(req, res) {
    const pool = require('../pool.js');

    var query = 'SELECT * FROM note WHERE id = $1';
    var note_id = req.query.id;
    pool.query(query, [note_id], function(err, res2) {
        if (err) {
            console.log(err.stack)
        } else {
            res.statusCode = 200;
            res.json(res2.rows)
        }
    })
}

// update note
function updateNote(req, res) {
    const pool = require('../pool.js');

    var query = 'UPDATE note '+
                'SET content = $3 '+
                'WHERE person_id = (SELECT id FROM person WHERE username = $1) AND title = $2;';
    var username = req.query.username;
    var title = req.query.title;
    var content = req.query.content;
    pool.query(query, [username, title, content], function(err, res2) {
        if (err) {
            console.log("error updating note");
            console.log(err.stack)
        } else {
            if (res2.rowCount == 1) {
                console.log(username + " updated a note");
                res.statusCode = 201;
                res.end('Updated note');
            }
        }
    })
}


module.exports = {
    createNote: createNote,
    getNotes: getNotes,
    getSingleNote: getSingleNote,
    updateNote: updateNote
};
