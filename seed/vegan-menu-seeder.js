//use this seeder to populate your database with data
//Bash shell commmand: node vegan-menu-seeder.js
//Please to perform this task you need to be in the seeder directory

var Vegan = require('../models/vegan-menu');

var mongoose = require('mongoose');
//Connect to database
mongoose.connect('mongodb://localhost/shopping', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

var vegans = [
    new Vegan({
        imagePath: './images/pizza-1.jpg',
        title: 'Vegan Giardinera',
        description: 'Toppings: Artichoke, mushrooms, red onion and black olives, with tomato, vegan mozzarella alternative, garlic oil and parsley',
        price: 17.90
    }),
    new Vegan({
        imagePath: './images/pizza-2.jpg',
        title: 'Vegan Veneziana',
        description: 'Toppings: Pine kernels, red onion, capers, black olives, sultanas, vegan mozzarella and tomato',
        price: 16.50
    }),
    new Vegan({
        imagePath: './images/pizza-3.jpg',
        title: 'Vegan Mezze',
        description: 'Toppings: Chilli chargrilled aubergine, tomato, garlic oil, smoky tomato harissa, jalapeño & Roquito peppers and rocket. Served with salad and houmous',
        price: 17.90
    }),
];
var done =0;

//Save Products to de database
for(var i=0; i< vegans.length; i++){
    vegans[i].save(function(err, result){
        done++;
        if(done === vegans.length){
            exit();
        }
    });
}

function exit(){
    //Desconect db
    mongoose.disconnect();
}

