<script>
    $('#donate-button').on('click', function(e) {
        var target = $(e.target);
        var moneyAmount;
        if (target.attr('id') == 'donate-button') {
            moneyAmount = $('#input-money-amount').val();
            if (moneyAmount < 0.2) {
                alert('Please enter amount higher than 0.2 USD');
                return;
            }
            $('#modal-title-paypal').text('Donate total: $' + moneyAmount);
        }

        $('#paypal-button-container').remove();
        $('#modal-paypal-body').append($('<div id="paypal-button-container"></div>'));

        paypal.Buttons({
            style: {
                color: 'gold',
                label: 'pay'
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: moneyAmount
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Thank you very much for your donation ' + details.payer.name.given_name);
                });
            }
        }).render('#paypal-button-container'); // Display payment options on your web page
        $('#modalPayPal').modal("show");
    })
</script>
