const {model, Schema} = require('mongoose');

const paymentSchema = new Schema({
    payment_id:{
        type: String,
        required: true
    },
    subscription_id:{
        type: String,
        required: true
    },
    signature:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

const paymentModel = new model('Payment', paymentSchema);

module.exports = paymentModel;