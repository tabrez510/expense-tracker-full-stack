const Razorpay = require('razorpay');
const Order = require('../models/orders');

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 500;

        rzp.orders.create({amount, currency: "INR"}, async(err, order) => {
            if(err) {
                return res.status(401).json({ message: 'Something went wrong', error: err });
            }

            try {
                await req.user.createOrder({orderId: order.id, status: 'PENDING'});
                return res.status(201).json({order, key_id: rzp.key_id});
            } catch(err) {
                res.status(401).json({ message: 'Something went wrong', error: err });
            }
        });


    } catch(err) {
        console.log(err);
        res.status(401).json({message: 'Something went wrong', error: err});
    }
}

const updateTransactionStatus = async(req, res) => {
    try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderId: order_id}});
        await order.update({paymentId: payment_id, status: 'SUCCESSFUL'});
        await req.user.update({isPremiumUser: true});
        return res.status(202).json({success: true, message: 'Transaction Successful'});
    } catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports ={
    purchasepremium,
    updateTransactionStatus
}