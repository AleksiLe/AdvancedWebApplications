var express = require('express');
var router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
//Database Connection
const mongoose = require('../database/db')
const dp = mongoose.connection
dp.on('error', console.error.bind(console, 'MongoDB connection error:'))

//Database Models
const Recipe = require('../database/models/Recipes')
const Category = require('../database/models/Categories')
const Image = require('../database/models/images');
//Populate categories
/* category.create({
  name: 'Gluten-free'
})
category.create({
  name: 'vegan'
})
category.create({
  name: 'Ovo'
}) */


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/categories', async function(req, res, next) {
  try {
    const data = await Category.find({});

    if (!data) {
      console.log('No data found')
    }

    if (data) {
      res.send(data)
    }

  } catch (error) {
    console.log(error);
  }
})

router.get('/recipe/:food', async function(req, res, next) {
  try {
    const data = await Recipe.findOne({
      name: req.params.food
    });

    if (!data) {
      console.log('No data found')
    }

    if (data) {
      res.send({
        'name': data.name,
        'ingredients': data.ingredients,
        'instructions': data.instructions,
        'images': data.images})
    }

  } catch (error) {
    console.log(error);
  }

})

router.post('/recipe/', async function(req, res, next) {
  try {
    const data = await Recipe.findOne({
      name: req.body.name,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions
    });
    if (!data) {
      Recipe.create({
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        categories: req.body.categories,
        images: req.body.images
      });
    }
    else if (data) {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
  res.send(req.body)
})

router.post('/images', upload.array('images'), uploadFiles)
async function uploadFiles(req, res) {
    let listOfImageIds = []
    try {
      for (let i = 0; i < req.files.length; i++){
        const imageInDB = await Image.create({
          name: req.files[i].originalname,
          encoding: req.files[i].encoding,
          mimetype: req.files[i].mimetype,
          buffer: req.files[i].buffer
        })
      listOfImageIds.push(imageInDB._id)
    }
    console.log(listOfImageIds)
    res.send({ imageIds: listOfImageIds });

    } catch (error) {
        console.log(error);
    }
}

router.get('/images/:id', async function(req, res, next) {
  try {
    const data = await Image.findOne({
      _id: req.params.id
    });

    if (!data) {
      console.log('No data found')
    }

    if (data) {
      res.setHeader('Content-type', `${data.mimetype}`);
      res.setHeader('Content-Disposition', 'inline');
      // console.log(image);
      const base64String = Buffer.from(data.buffer).toString('base64');
      const dataUrl = `data:${data.mimetype};base64, ${base64String}`;

      res.send({dataUrl: dataUrl});
    }

  } catch (error) {
    console.log(error);
  }
})



module.exports = router;
