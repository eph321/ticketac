var express = require('express');
const { rawListeners } = require('../models/journeys');
var router = express.Router();
var journeyModel=require("../models/journeys");
var UserModel=require("../models/users");



var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]
let erreur='false';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express', erreur });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
res.render('login', { title: 'Express' });
});

router.get('/notrain', function(req, res, next) {

  res.render('notrain', { title: 'Express' });
  });


// route résultats recherche

router.post('/buy-ticket', async function (req, res, next){


resultData = await journeyModel.find({departure:req.body.depart, arrival: req.body.arrive, date:req.body.date});

/* ticketDate = new Date(req.body.date); */

console.log(resultData);

/* for (let el of resultData) {
 console.log( ticketDate, el.date )
  if (ticketDate == el.date) { 
  console.log("MEME DATE OK");
}
} 
 */
  res.render('notrain')
})

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});



module.exports = router;
