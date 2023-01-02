// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import moment from 'moment-timezone';

import { drrr } from './genre/drrr';
import { yahoo } from './genre/yahoo';
import { serversus } from './genre/serversus';

const paso = require('./genre/paso');

const app = express();
const port = process.env.PORT || 1234;

app.use(cors());

app.get('/abc', async (req, res) => {
  res.json({ date: new Date() });
});

app.listen(port, async () => {
  console.log(port);
  console.log(process.env.NODE_ENV);
});

cron.schedule('*/10 * * * *', async () => {
  console.log('cron');

  const now = moment(new Date());
  now.tz('Asia/Tokyo').format('ha z');

  const hour = now.hour();
  const minute = now.minute();

  try {
    // yahoo
    await yahoo().catch(e => console.log(e));

    // serversus
    if (hour === 1 && minute < 10) {
      await serversus().catch(e => console.log(e));
    }

    // paso
    if (hour <= 23 && hour >= 8 && minute < 10) {
      await paso().catch(e => console.log(e));
    }

    // drrr
    if (hour >= 22 || hour <= 1) {
//       await drrr({ TARGET: process.env.DRRR_TARGET }).catch(e =>
//         console.log(e)
//       );
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log('cron fin');
  }
});
