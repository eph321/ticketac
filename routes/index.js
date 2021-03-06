var express = require('express');
const { rawListeners } = require('../models/journeys');
var router = express.Router();
var journeyModel=require("../models/journeys");
var userModel=require("../models/users");


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]
let erreur='false';
var journeys=[];

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login', { title: 'Ticketac', erreur });
});

router.get('/home', function(req, res, next) {
  
  res.render('index', { title: 'Ticketac' });
});


// router.get('/login', function(req, res, next) {
// res.render('login', { title: 'Ticketac' });
// });

// router.get('/results', function(req, res, next) {

//   res.render('/', { title: 'Ticketac', erreur });
//   });


// route résultats recherche

router.post('/buy-ticket', async function (req, res, next){

  resultData = await journeyModel.find({departure:req.body.depart, arrival: req.body.arrive, date:req.body.date});
/* ticketDate = new Date(req.body.date); */
  console.log(resultData);
  res.render('results' , { resultData})
})


router.get('/add-journey', async function (req,res, next){
  console.log('req query', req.query.journeyId); 
  req.session.journeys.push (req.query.journeyId);
  console.log('req.session.journeys',  req.session.journeys );
  let journeyList=[];
  for (let i=0; i< req.session.journeys.length; i++){
    let journey = await journeyModel.findById(req.session.journeys[i]);
    journeyList.push( journey);
  }
  //console.log('journeyList', journeyList);
  res.render('basket' , { journeys: journeyList})
});

router.get('/confirm', async function (req,res, next){

   //console.log ('rquery', JSON.parse(req.query.journeyList));
   //console.log ('reqsession', req.session.userid);
   // on recupère le panier de voyages et on le parse pour retrouver un objet JS
   let basket = JSON.parse(req.query.journeyList);
   //on va charcher le user de la session dans la BDD 
   let user = await userModel.findById (req.session.userid);
   //console.log( 'user avant', user);
  //on ajoute chaque voyage confirmé dans l'historique du user de la BDD
   for (let i=0; i< basket.length; i++){
      user.journeys.push(basket[i]._id);
   }
   //console.log('user apres', user);
   //on push les nouveaux voayges dans la liste existante
    await userModel.updateOne(
               { _id: req.session.userid},     // ce qu'on cherche
               { journeys:  user.journeys }     //ce qu'on modifie
       ); 
  // on vide le panier de la session avant de retourner sur la homepage
  req.session.journeys=[];
  res.redirect('/home');
});


router.get('/mytrips', async function (req, res, next){
  
  var user = await userModel.findById(req.session.userid)
       .populate('journeys')
       .exec();
 
  console.log( user.journeys);

  res.render('mytrips', { mytrips: user.journeys});
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


router.get('/notrain', function(req, res, next) {
res.render('notrain', { title: 'Express' });
  });


// route résultats recherche

// router.post('/buy-ticket', async function (req, res, next){
// resultData = await journeyModel.find({departure:req.body.depart, arrival: req.body.arrive, date:req.body.date});
// /* ticketDate = new Date(req.body.date); */
// console.log(resultData);

// /* for (let el of resultData) {
//  console.log( el.price )
//   if (ticketDate == el.date) { 
//   console.log("MEME DATE OK")} 
// }  */

// var dateFormat = req.body.date
//   res.render('notrain')
// })

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
