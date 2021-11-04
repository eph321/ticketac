var express = require('express');
var router = express.Router();
var userModel=require('../models/users');

let erreur='false';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// ROUTES USERS

router.post('/sign-up', async function (req,res,next){
  var userSearch=req.body.newUserEmail.toLowerCase();
  var alreadyIn = await userModel.findOne({email:userSearch});
  //si alreadyIn ==null on ajoute le nouvel user
  if (!alreadyIn){
    
  var newUser = new userModel ({
    lastname: req.body.newUserName, 
    firstname: req.body.newUserFirstName, 
    email: req.body.newUserEmail, 
    password:req.body.newUserPassword
    });          
  var user = await newUser.save(); 
  // req.session.user = user.userName;
  // req.session.id=user._ID;

  res.redirect('/home');
} else {
    erreur='alreadyIn';
    console.log('alreadyIn', erreur);
    res.render ('login', {erreur} );
}
});

router.post('/sign-in', async function (req,res,next){
  var userSearch=req.body.userEmail.toLowerCase();
  var alreadyIn = await userModel.findOne({email:userSearch});
  //si alreadyIn =null le user n'existe pas 
  if (!alreadyIn){
    console.log("utilisateur n'existe pas" );
    erreur='noExist';
    res.render ('login', {erreur} );
  } else { 
    // si le user existe on valide qu'il a bien le bon password + email
    var loginOk = await userModel.findOne({ email:req.body.userEmail.toLowerCase(), password:req.body.userPassword });
    if( loginOk) {
      console.log('reqbody',req.body);
      // req.session.user =loginOk.userName;
      // req.session.id=loginOk._ID;

      res.redirect ('/home');
    } else {
      console.log("pwd" );
      erreur='pwd';
      res.render ('login', {erreur} );
    } 
  }
});



router.get ('/logout', function (req,res,next){
  req.session.destroy();
  res.redirect('/');      
})



module.exports = router;
