//use this seeder to populate your database with data
//Bash shell commmand: node product-seeder.js
//Please to perform this task you need to be in the seeder directory

var Product = require('../models/product');

var mongoose = require('mongoose');

//Connect to database
mongoose.connect('mongodb://localhost/shopping', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

var products = [
    new Product({
        imagePath: './images/pizza-1.jpg',
        title: 'Marguerita',
        description: 'Pizza',
        price: 10
    }),
    new Product({
        imagePath: './images/pizza-2.jpg',
        title: 'Marguerita',
        description: 'Pizza',
        price: 10
    }),
    new Product({
        imagePath: './images/pizza-3.jpg',
        title: 'Margueritha',
        description: 'Pizza',
        price: 10
    }),
];
var done =0;

//Save Products to de database
for(var i=0; i< products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    //Desconnect db
    mongoose.disconnect();
}

