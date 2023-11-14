var express = require('express');
var router = express.Router();

let list = []
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My todos' });
});

router.post('/todo', function(req, res, next) {
  const tulos = list.findIndex((item) => {
    return item.name == req.body.name
  })
  console.log(tulos)
  if (tulos == -1) {
    list.push({name: req.body.name, todo: [req.body.todo]})
    res.send({status: 'User added!'})
  }
  else {
    list[tulos].todo.push(req.body.todo)
    res.send({status: 'Todo added!'})
  }
});

router.get('/user/:id', function(req, res, next) {
  const tulos = list.findIndex((item) => {
    return item.name == req.params.id
  })
  if (tulos == -1) {
    res.send({status: 'User not found'})
  }
  else {
    res.send(list[tulos])
  }
})

router.delete('/user/:id', function(req, res, next) {
  const tulos = list.findIndex((item) => {
    return item.name == req.params.id
  })
  if (tulos == -1) {
    res.send({status: 'User not found'})
  }
  else {
    list.splice(tulos, 1)
    res.send({status: 'User deleted'})
  }
})

router.put('/user', function(req, res, next) {
  const tulos = list.findIndex((item) => {
    return item.name == req.body.name
  })
  if (tulos == -1) {
    res.send({status: 'User not found'})
  }
  else {
    const tulos2 = list[tulos].todo.findIndex((item) => {
      return item == req.body.todo
    })
    if (tulos2 == -1) {
      res.send({status: 'Task not found'})
    }
    else {
      list[tulos].todo.splice(tulos2, 1)
      console.log('Task deleted')
      res.send({status: 'Task deleted'})
    }
  }
})

module.exports = router;
