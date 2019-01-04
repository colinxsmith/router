const express = require('express');
const router = express.Router();
const mocked = { 
    'results': [
        {        'id': '1',        'name': 'RDJ',        'movies': '100'    },
        {        'id': '2',        'name': 'Tom Holland',        'movies': '3'    },
        {        'id': '3',        'name': 'Benedict Cumberbatch',        'movies': '10'    },
        {        'id': '4',        'name': 'Chris Hemsworth',        'movies': '30'    },
        {        'id': '5',        'name': 'Chris Evans',        'movies': '20'    }
        ]
      ,
          'OPT':[{'gamma': 0.000000, 'risk': 0.059686, 'return': -0.000072, 'portfolio':[ 
    {'id': 1, 'axis': 'USD.SYXI', 'value': -0.014823, 'alpha': 0.007012}, 
    {'id': 2, 'axis': 'USD.EBAY', 'value': 0.037393, 'alpha': 0.005849}, 
    {'id': 3, 'axis': 'USD.LBAI', 'value': -0.068549, 'alpha': 0.001918}, 
    {'id': 4, 'axis': 'USD.WEBK', 'value': -0.163104, 'alpha': 0.001969}, 
    {'id': 5, 'axis': 'USD.SFFS', 'value': 0.115181, 'alpha': 0.002987}, 
    {'id': 6, 'axis': 'USD.ZETA', 'value': 0.008887, 'alpha': 0.008548}, 
    {'id': 7, 'axis': 'USD.HLTH', 'value': -0.022184, 'alpha': 0.005237}, 
    {'id': 8, 'axis': 'USD.TOVC', 'value': 0.012863, 'alpha': 0.007933}, 
    {'id': 9, 'axis': 'USD.UCBH', 'value': -0.107352, 'alpha': 0.002321}, 
    {'id': 10, 'axis': 'USD.FOX', 'value': -0.059202, 'alpha': 0.002906}, 
    {'id': 11, 'axis': 'USD.MNY', 'value': 0.085906, 'alpha': 0.001873}, 
    {'id': 12, 'axis': 'USD.PRSP', 'value': 0.104621, 'alpha': 0.001954}, 
    {'id': 13, 'axis': 'USD.72650310', 'value': -0.105695, 'alpha': 0.001622}, 
    {'id': 14, 'axis': 'USD.MMR', 'value': 0.014742, 'alpha': 0.006184}, 
    {'id': 15, 'axis': 'USD.SBP', 'value': 0.142735, 'alpha': 0.001048}, 
    {'id': 16, 'axis': 'USD.SCFS', 'value': -0.100875, 'alpha': 0.001963}, 
    {'id': 17, 'axis': 'USD.21922V10', 'value': 0.095291, 'alpha': 0.001632}, 
    {'id': 18, 'axis': 'USD.SCSS', 'value': -0.019390, 'alpha': 0.005487}, 
    {'id': 19, 'axis': 'USD.PFCB', 'value': 0.058882, 'alpha': 0.002690}, 
    {'id': 20, 'axis': 'USD.CNXT', 'value': -0.009033, 'alpha': 0.010549}, 
    {'id': 21, 'axis': 'USD.TBNC', 'value': -0.039468, 'alpha': 0.003152}, 
    {'id': 22, 'axis': 'USD.CNQR', 'value': -0.011884, 'alpha': 0.008523}, 
    {'id': 23, 'axis': 'USD.HIFN', 'value': 0.017032, 'alpha': 0.008387}, 
    {'id': 24, 'axis': 'USD.INSP', 'value': -0.012093, 'alpha': 0.009788}, 
    {'id': 25, 'axis': 'USD.PPE', 'value': -0.067002, 'alpha': 0.001884}, 
    {'id': 26, 'axis': 'USD.WGBC', 'value': 0.117691, 'alpha': 0.002624}, 
    {'id': 27, 'axis': 'USD.ONFC', 'value': -0.063075, 'alpha': 0.002900}, 
    {'id': 28, 'axis': 'USD.FPFC', 'value': -0.125129, 'alpha': 0.001904}, 
    {'id': 29, 'axis': 'USD.FCN', 'value': 0.035765, 'alpha': 0.003423}, 
    {'id': 30, 'axis': 'USD.BSML', 'value': -0.011141, 'alpha': 0.005411}, 
    {'id': 31, 'axis': 'USD.LACO', 'value': 0.027483, 'alpha': 0.003846}, 
    {'id': 32, 'axis': 'USD.PBCP', 'value': 0.125529, 'alpha': 0.001627} 
    ]}, 
    {'gamma': 1.000000, 'risk': 0.551416, 'return': 0.009501, 'portfolio':[ 
    {'id': 1, 'axis': 'USD.SYXI', 'value': 0.000000, 'alpha': 0.007012}, 
    {'id': 2, 'axis': 'USD.EBAY', 'value': 0.000000, 'alpha': 0.005849}, 
    {'id': 3, 'axis': 'USD.LBAI', 'value': 0.000000, 'alpha': 0.001918}, 
    {'id': 4, 'axis': 'USD.WEBK', 'value': 0.000000, 'alpha': 0.001969}, 
    {'id': 5, 'axis': 'USD.SFFS', 'value': 0.000000, 'alpha': 0.002987}, 
    {'id': 6, 'axis': 'USD.ZETA', 'value': 0.000000, 'alpha': 0.008548}, 
    {'id': 7, 'axis': 'USD.HLTH', 'value': 0.000000, 'alpha': 0.005237}, 
    {'id': 8, 'axis': 'USD.TOVC', 'value': 0.000000, 'alpha': 0.007933}, 
    {'id': 9, 'axis': 'USD.UCBH', 'value': 0.000000, 'alpha': 0.002321}, 
    {'id': 10, 'axis': 'USD.FOX', 'value': 0.000000, 'alpha': 0.002906}, 
    {'id': 11, 'axis': 'USD.MNY', 'value': 0.000000, 'alpha': 0.001873}, 
    {'id': 12, 'axis': 'USD.PRSP', 'value': 0.000000, 'alpha': 0.001954}, 
    {'id': 13, 'axis': 'USD.72650310', 'value': 0.000000, 'alpha': 0.001622}, 
    {'id': 14, 'axis': 'USD.MMR', 'value': 0.000000, 'alpha': 0.006184}, 
    {'id': 15, 'axis': 'USD.SBP', 'value': -1.000000, 'alpha': 0.001048}, 
    {'id': 16, 'axis': 'USD.SCFS', 'value': 0.000000, 'alpha': 0.001963}, 
    {'id': 17, 'axis': 'USD.21922V10', 'value': 0.000000, 'alpha': 0.001632}, 
    {'id': 18, 'axis': 'USD.SCSS', 'value': 0.000000, 'alpha': 0.005487}, 
    {'id': 19, 'axis': 'USD.PFCB', 'value': 0.000000, 'alpha': 0.002690}, 
    {'id': 20, 'axis': 'USD.CNXT', 'value': 1.000000, 'alpha': 0.010549}, 
    {'id': 21, 'axis': 'USD.TBNC', 'value': 0.000000, 'alpha': 0.003152}, 
    {'id': 22, 'axis': 'USD.CNQR', 'value': 0.000000, 'alpha': 0.008523}, 
    {'id': 23, 'axis': 'USD.HIFN', 'value': 0.000000, 'alpha': 0.008387}, 
    {'id': 24, 'axis': 'USD.INSP', 'value': 0.000000, 'alpha': 0.009788}, 
    {'id': 25, 'axis': 'USD.PPE', 'value': 0.000000, 'alpha': 0.001884}, 
    {'id': 26, 'axis': 'USD.WGBC', 'value': 0.000000, 'alpha': 0.002624}, 
    {'id': 27, 'axis': 'USD.ONFC', 'value': 0.000000, 'alpha': 0.002900}, 
    {'id': 28, 'axis': 'USD.FPFC', 'value': 0.000000, 'alpha': 0.001904}, 
    {'id': 29, 'axis': 'USD.FCN', 'value': 0.000000, 'alpha': 0.003423}, 
    {'id': 30, 'axis': 'USD.BSML', 'value': 0.000000, 'alpha': 0.005411}, 
    {'id': 31, 'axis': 'USD.LACO', 'value': 0.000000, 'alpha': 0.003846}, 
    {'id': 32, 'axis': 'USD.PBCP', 'value': 0.000000, 'alpha': 0.001627} 
    ]}, 
    {'gamma': 0.895228, 'risk': 0.207205, 'return': 0.005230, 'portfolio':[ 
    {'id': 1, 'axis': 'USD.SYXI', 'value': 0.050076, 'alpha': 0.007012}, 
    {'id': 2, 'axis': 'USD.EBAY', 'value': 0.010475, 'alpha': 0.005849}, 
    {'id': 3, 'axis': 'USD.LBAI', 'value': -0.002504, 'alpha': 0.001918}, 
    {'id': 4, 'axis': 'USD.WEBK', 'value': -0.116998, 'alpha': 0.001969}, 
    {'id': 5, 'axis': 'USD.SFFS', 'value': 0.044072, 'alpha': 0.002987}, 
    {'id': 6, 'axis': 'USD.ZETA', 'value': 0.084913, 'alpha': 0.008548}, 
    {'id': 7, 'axis': 'USD.HLTH', 'value': 0.038986, 'alpha': 0.005237}, 
    {'id': 8, 'axis': 'USD.TOVC', 'value': 0.098845, 'alpha': 0.007933}, 
    {'id': 9, 'axis': 'USD.UCBH', 'value': 0.000000, 'alpha': 0.002321}, 
    {'id': 10, 'axis': 'USD.FOX', 'value': -0.024791, 'alpha': 0.002906}, 
    {'id': 11, 'axis': 'USD.MNY', 'value': -0.042335, 'alpha': 0.001873}, 
    {'id': 12, 'axis': 'USD.PRSP', 'value': -0.001184, 'alpha': 0.001954}, 
    {'id': 13, 'axis': 'USD.72650310', 'value': -0.266204, 'alpha': 0.001622}, 
    {'id': 14, 'axis': 'USD.MMR', 'value': 0.061709, 'alpha': 0.006184}, 
    {'id': 15, 'axis': 'USD.SBP', 'value': -0.207403, 'alpha': 0.001048}, 
    {'id': 16, 'axis': 'USD.SCFS', 'value': 0.038928, 'alpha': 0.001963}, 
    {'id': 17, 'axis': 'USD.21922V10', 'value': -0.195904, 'alpha': 0.001632}, 
    {'id': 18, 'axis': 'USD.SCSS', 'value': 0.061933, 'alpha': 0.005487}, 
    {'id': 19, 'axis': 'USD.PFCB', 'value': -0.041900, 'alpha': 0.002690}, 
    {'id': 20, 'axis': 'USD.CNXT', 'value': 0.093785, 'alpha': 0.010549}, 
    {'id': 21, 'axis': 'USD.TBNC', 'value': 0.040547, 'alpha': 0.003152}, 
    {'id': 22, 'axis': 'USD.CNQR', 'value': 0.077250, 'alpha': 0.008523}, 
    {'id': 23, 'axis': 'USD.HIFN', 'value': 0.057353, 'alpha': 0.008387}, 
    {'id': 24, 'axis': 'USD.INSP', 'value': 0.103006, 'alpha': 0.009788}, 
    {'id': 25, 'axis': 'USD.PPE', 'value': -0.002819, 'alpha': 0.001884}, 
    {'id': 26, 'axis': 'USD.WGBC', 'value': 0.028879, 'alpha': 0.002624}, 
    {'id': 27, 'axis': 'USD.ONFC', 'value': 0.028558, 'alpha': 0.002900}, 
    {'id': 28, 'axis': 'USD.FPFC', 'value': 0.000000, 'alpha': 0.001904}, 
    {'id': 29, 'axis': 'USD.FCN', 'value': 0.000000, 'alpha': 0.003423}, 
    {'id': 30, 'axis': 'USD.BSML', 'value': 0.047955, 'alpha': 0.005411}, 
    {'id': 31, 'axis': 'USD.LACO', 'value': 0.032731, 'alpha': 0.003846}, 
    {'id': 32, 'axis': 'USD.PBCP', 'value': -0.097958, 'alpha': 0.001627} 
        ]
        }]
};

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
router.post('/results', (req, res) => {
    res
    .status(200)
    .send(req.body);
});
router.put('/results', (req, res) => {
    res
    .status(200)
        .send(req.body);
});
router.post('/db', (req) => {
    console.log(req.body);
    router.get('/results', (rrr, res) => {
        res
            .status(200)
            .send(req.body);
    });
});
router.put('/db', (req, res) => {
    res
    .status(200)
    .send(req.body);
});
module.exports = router;