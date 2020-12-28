var express = require ('express');
var router = express.Router();
var csrf = require('csurf');
var Product  = require('../models/product');
var Kid = require('../models/kids-menu');
var Vegan = require('../models/vegan-menu');
var Cart = require('../models/cart');
var Order = require('../models/order');

/*Get Home page*/
router.get('/', function(req, res, next){
        res.render('shop/home')
});

/*Display Vegan-menu*/
router.get('/vegan-menu', function(req, res, next){
    var products = Vegan.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 3;
        for(var i=0; i<docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i+ chunkSize));
        }
        res.render('shop/vegan-menu', { title: 'Shopping Cart', products: productChunks })
    }).lean(); //In case use mongoose use lean()
});

/*Display Kids-menu*/
router.get('/kids-menu', function(req, res, next){
    var products = Kid.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 3;
        for(var i=0; i<docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i+ chunkSize));
        }
        res.render('shop/kids-menu', { title: 'Shopping Cart', products: productChunks })
    }).lean(); //In case use mongoose use lean()
});

/*Display Menu*/
router.get('/menu', function(req, res, next){
    var products = Product.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 3;
        for(var i=0; i<docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i+ chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks })
    }).lean(); //In case use mongoose use lean()
});

//Add produt to cart SPRING MENU
router.get('/add-to-cart/:id', function(req, res,next){
    var productId = req.params.id;
    var cart  = new Cart(req.session.cart ? req.session.cart: {});
   
        Product.findById(productId, function(err,product){
            if(err){
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        });
});

//Add produt to cart KIDS
router.get('/add-to-cart-k/:id', function(req, res,next){
    var productId = req.params.id;
    var cart  = new Cart(req.session.cart ? req.session.cart: {});
   
        Kid.findById(productId, function(err,product){
            if(err){
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        });
});

//Add produt to cart VEGAN
router.get('/add-to-cart-v/:id', function(req, res,next){
    var productId = req.params.id;
    var cart  = new Cart(req.session.cart ? req.session.cart: {});
   
        Vegan.findById(productId, function(err,product){
            if(err){
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        });
});

//Remove an item from the cart
router.get('/reduce/:id', function(req, res, next){
    var productId= req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//Remove entire item from the cart
router.get('/remove/:id', function(req, res, next){
    
    var productId= req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{});
    
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

//Display shopping-cart 
router.get('/shopping-cart', function(req, res, next){
    if(!req.session.cart){
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//Checkout 
router.get('/checkout', isLoggedIn, function(req, res, next){
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

//Successful data
router.post('/checkout', isLoggedIn,function(req, res, next){
    
    //if cart is empty redirect
    if(!req.session.cart){
        return res.redirect('/shopping-cart')
    }

    var cart = new Cart(req.session.cart);
    //When create an account on stripe set your private key here
    const stripe = require('stripe')('sk_test_iCJpi1dhMn8XnacPqyjdy1iW00blG03M1t');

    stripe.charges.create({
        amount: cart.totalPrice*100,
        currency: "eur",
        source: req.body.stripeToken, // obtained with Stripe.js
      }, function (err, charge){
          if(err){
              req.flash('error', err.message);
              return res.redirect('/checkout');
          }
          //Store the order in the database
          var order = new Order({
              user: req.user,
              cart: cart,
              address: req.body.address,
              name: req.body.name,
              paymentId: charge.id
          });
          order.save(function(err,result){
             req.flash('success', 'Sucessfully bought product!');
             req.session.cart = null;
             var successMsg = req.flash('success')[0];
             res.render('shop/end-checkout', {successMsg: successMsg, noMessages: !successMsg });
          }); 
      });
})
//Export all routers
module.exports = router;

//Function that checks if a user is logged in, otherwise redirect ot index page
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}