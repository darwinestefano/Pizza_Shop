//use this seeder to populate your database with data
//Bash shell commmand (cmd): node kids-menu-seeder.js
//Please to perform this task you need to be in the seeder directory

var Kid = require('../models/kids-menu');

var mongoose = require('mongoose');
//Connect to database
mongoose.connect('mongodb://localhost/shopping', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

var kids = [
    new Kid({
        imagePath: './images/pizza-1.jpg',
        title: 'Margueritha',
        description: 'Toppings: Mozzarella and Tomato',
        price: 7.8
    }),
    new Kid({
        imagePath: './images/pizza-2.jpg',
        title: 'La Reine',
        description: 'Toppings: Ham, black olives and closed up mushrooms',
        price: 8.0
    }),
    new Kid({
        imagePath: './images/pizza-3.jpg',
        title: 'Pollo',
        description: 'Toppings: Chicken and Tomato !!',
        price: 7.8
    }),
];
var done =0;

//Save Products to de database
for(var i=0; i< kids.length; i++){
    kids[i].save(function(err, result){
        done++;
        if(done === kids.length){
            exit();
        }
    });
}

function exit(){
    //Desconect db
    mongoose.disconnect();
}

