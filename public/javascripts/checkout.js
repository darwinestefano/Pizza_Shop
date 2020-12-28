//Get Publishable Key --> You need to set up an account on Stripe and get its sharable key
Stripe.setPublishableKey('pk_test_vP5WzEjt1XmWQ3L91Rz8ykXR00p8iLyGUf');

//Valite stripe to receive payment 
//Create a Token to process payment
var $form  = $('#checkout-form');
$form.submit(function(event){
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response){
    if(response.error){
        //Show the errors on the form 
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); //Re-enable submission
    } else { //Token was created
        
        //Get the token ID
        var token = response.id;

        //Insert the token ID:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        //submit
        $form.get(0).submit();
    }
}