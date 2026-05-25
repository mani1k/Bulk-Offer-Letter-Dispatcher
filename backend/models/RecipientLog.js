const mongoose = require('mongoose');

const RecipientLogSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  role: { type: String, trim: true },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  error: { type: String, trim: true },
  templateId: { type: String, trim: true },
  templateName: { type: String, trim: true },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('RecipientLog', RecipientLogSchema);
