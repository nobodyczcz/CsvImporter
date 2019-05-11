var mongoose = require('mongoose');

/**
 * This module defines the scheme for orders collection
 */
var Schema = mongoose.Schema;
var OrdersSchema = new Schema( {
    orderId: {type: String,index: true, required: true, unique: true},
    customerId:String,
    item: String,
    quantity:Number
} );
module.exports = OrdersSchema;