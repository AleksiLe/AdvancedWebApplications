var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recipe/:food', function(req, res, next) {
  res.send({
    'name': req.params.food,
    'ingredients': ['ingredient1', 'ingredient2', 'ingredient3'],
    'instructions': ['step1', 'step2', 'step3']})
})

router.post('/recipe/', function(req, res, next) {
  res.send(req.body)
})

router.post('/images', function(req, res, next) {
  res.send({'status': 'Hi'})
})

module.exports = router;
