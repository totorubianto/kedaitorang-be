import express from 'express';
import payload from 'payload';
import { routers } from './api';
import cors from "cors"
import fs from "fs"
import path from 'path';

var bodyParser = require('body-parser')
const qrcode = require('qrcode-terminal');
const SESSION_FILE_PATH = './wtf-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  restartOnAuthFail: true,
  authStrategy: new LocalAuth({
    clientId: "client-one"
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  session: sessionCfg
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
require('dotenv').config();

const app = express();
app.use(cors());
app.use('/media', express.static('dist/media'))
console.log(path.resolve(__dirname, '../assets'))
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

app.get('/', (_, res) => {
  res.redirect('https://m.kedaitorang.site');
});

app.use(bodyParser.json())

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })
  const router = express.Router();
  router.use(payload.authenticate);

  app.use("/custom", routers(router, payload, client));

  // Add your own express routes here

  app.listen(3000);
}

start();
