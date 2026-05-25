require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const RecipientLog = require('./models/RecipientLog');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP environment variables');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post('/api/send-emails', async (req, res) => {
  const { recipients, template, dispatchSettings } = req.body;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: 'Recipients array is required' });
  }
  if (!template || typeof template.body !== 'string') {
    return res.status(400).json({ message: 'Template body is required' });
  }

  const transporter = createTransporter();
  const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const throttleMs = Number(dispatchSettings?.delayMs || 750);
  const retryOnFail = Boolean(dispatchSettings?.retryOnFail);

  let sentCount = 0;
  const results = [];

  for (const recipient of recipients) {
    const mailBody = Object.entries(recipient).reduce((body, [key, value]) => {
      return body.replaceAll(`{${key}}`, value || '');
    }, template.body);

    const message = {
      from: fromAddress,
      to: recipient.Email,
      subject: template.subject || `Offer letter for ${recipient.Name || recipient.Email}`,
      text: mailBody
    };

    let attempt = 0;
    let lastError = null;
    let currentStatus = 'failed';

    while (attempt < (retryOnFail ? 2 : 1)) {
      try {
        await transporter.sendMail(message);
        currentStatus = 'sent';
        sentCount += 1;
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        attempt += 1;
        if (!retryOnFail) break;
      }
    }

    await RecipientLog.create({
      name: recipient.Name,
      email: recipient.Email,
      role: recipient.Role,
      status: currentStatus,
      error: lastError?.message,
      templateId: template.id,
      templateName: template.name
    });

    results.push({ email: recipient.Email, status: currentStatus, error: lastError?.message });
    await delay(throttleMs);
  }

  res.json({ sentCount, total: recipients.length, results });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
