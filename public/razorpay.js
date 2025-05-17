 document.querySelectorAll('.razorpay-btn').forEach(function(btn){
        btn.addEventListener('click', function(e){
            e.preventDefault();
            const amount = btn.getAttribute('data-amount');
            const housename = btn.getAttribute('data-housename');
            fetch('/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount })
            })
            .then(res => res.json())
            .then(order => {
                var options = {
                    "key": "rzp_test_FkhYGi7Wa4Thcy", // Replace with your Razorpay key_id
                    "amount": order.amount,
                    "currency": order.currency,
                    "name": "Staynest",
                    "description": housename + " Booking Payment",
                    "order_id": order.id,
                    "handler": function (response){
                        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                    },
                    "theme": {
                        "color": "#F37254"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();
            });
        });
    });