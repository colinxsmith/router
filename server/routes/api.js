'use strict;'
const opt = require('../../optimiser/optimiser');
const express = require('express');
const router = express.Router();
const mocked = { 
    'version': opt.version(),
    'OPT': opt.output,
    'results': [
        {        'id': 1,        'name': 'RDJ',        'movies': 100    },
        {        'id': 2,        'name': 'Tom Holland',        'movies': 3    },
        {        'id': 3,        'name': 'Benedict Cumberbatch',        'movies': 10    },
        {        'id': 4,        'name': 'Chris Hemsworth',        'movies': 30    },
        {        'id': 5,        'name': 'Chris Evans',        'movies': 20    }
        ]
};
let ind = -1;
/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});
// Get all posts
router.get('/db', (req, res) => {
    res
        .status(200)
        .json(mocked);
});
router.post('/results', (req, bbb) => {
    console.log('POST');
    let leave = false;
    mocked.results.forEach((d, i) => {
        if (d.name === req.body.name) {
            bbb
                .status(500)
                .json(mocked); 
            leave = true;
            ind = i;
            console.log('NOT NEW '  + ind);
        }
    });
    if (leave) {
        console.log('leave');
        router.put('/results/' + req.body.id, (req, bbbb) => {
            mocked.results[ind] = req.body;
            console.log(mocked.results);
            bbbb
                .status(200)
                .json(mocked);
        });
    } else {
    mocked.results.push(req.body);
    console.log(mocked.results);
    bbb
        .status(200)
        .json(mocked);
    }
});

module.exports = router;