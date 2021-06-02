const express = require('express');
const Food = require('../models/food');
const router = express.Router();

router.get('/foods', async (req, res) => {
  const foods = await Food.find(
    { 'name': 'apple' },
    'name calories',
    (err, foods) => {
      if (err) { return handleError(err); }
      
      return foods;
    }
  );

  try {
    res.send(foods);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.get('/food', async (req, res) => {
  var myNewFood = new Food({
    name: "apple",
    calories: 50
  });

  await myNewFood.save(function (err) {
    if (err) {
      return handleError(err);
    }
  });
  
  res.send(`${myNewFood.name} was saved!`);
});

module.exports = router;
