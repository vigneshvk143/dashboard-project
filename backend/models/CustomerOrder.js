const mongoose = require('mongoose');

const customerOrderSchema = new mongoose.Schema(
  {
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
    address:     { type: String, required: true, trim: true },
    city:        { type: String, required: true, trim: true },
    state:       { type: String, required: true, trim: true },
    postalCode:  { type: String, required: true, trim: true },
    country:     { type: String, required: true, enum: ['United States','Canada','Australia','Singapore','Hong Kong'] },
    product:     { type: String, required: true, enum: ['Fiber Internet 300 Mbps','5G Unlimited Mobile Plan','Fiber Internet 1 Gbps','Business Internet 500 Mbps','VoIP Corporate Package'] },
    quantity:    { type: Number, required: true, min: 1, default: 1 },
    unitPrice:   { type: Number, required: true, min: 0 },
    totalAmount: { type: Number },
    status:      { type: String, required: true, enum: ['Pending','In progress','Completed'], default: 'Pending' },
    createdBy:   { type: String, required: true, enum: ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin'] },
  },
  { timestamps: true }
);

customerOrderSchema.pre('save', function (next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('CustomerOrder', customerOrderSchema);
