const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  type:     { type: String, required: true },
  title:    { type: String, default: 'Untitled' },
  metric:   { type: String },
  xAxis:    { type: String },
  yAxis:    { type: String },
  color:    { type: String, default: '#10b981' },
  width:    { type: Number, default: 4 },
  height:   { type: Number, default: 4 },
  position: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
}, { _id: false });

const dashboardLayoutSchema = new mongoose.Schema({
  userId:  { type: String, default: 'demo' },
  name:    { type: String, default: 'My Dashboard' },
  widgets: [widgetSchema],
}, { timestamps: true });

module.exports = mongoose.model('DashboardLayout', dashboardLayoutSchema);
