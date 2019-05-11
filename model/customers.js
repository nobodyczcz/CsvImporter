var mongoose = require('mongoose');

/**
 * This module defines the scheme for customers collection
 */
var Schema = mongoose.Schema;
var CustomersSchema = new Schema( {
    customerId: {type: String,index: true, required: true, unique: true},
    firstName: String,
    lastName:String
} );
module.exports = CustomersSchema;