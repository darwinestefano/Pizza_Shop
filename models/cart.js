//Store in the session for now, not in the database
module.exports = function Cart(oldCart){
    
    //Get item from Cart stored in the session
    this.items  = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice =oldCart.totalPrice || 0;

    //Add a new item to Cart
    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price= storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    //Remove an item
    this.remove = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <=0){
            delete this.items[id];
        }
    };

    //Remove entire item
    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];  
    };

    //Generate list of item in the cart
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};