const axios = require('axios');
const { parse } = require('node-html-parser');
const mysql = require('mysql2');
const _ = require('lodash');

// require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  ssl: {
    rejectUnauthorized: true,
  },
});

const noti = async body => {
  await axios.post(
    'https://exp.host/--/api/v2/push/send',
    {
      to: [process.env.EXPO_ID, process.env.EXPO_ID2],
      title: 'pas',
      body: body,
      priority: 'high',
      sound: 'default',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

//
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results, fields) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(results);
    });
  });
};

module.exports = async () => {
  try {
    const ret = await query('select * from pasonahs where id = 1', []);
    const before = JSON.parse(ret[0].text);

    const res = await axios
      .get(
        `https://www.pasona.co.jp/jobsearch/1003/list?income_ll=&income_ul=&keywords=&dispatch_from__ymd=&sales_company_cd=HS&place_wide_cd=1003&place_area_cd=100317001&place_area_cd=100317002&place_area_cd=100317003`,
        {
          params: {},
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
          },
        }
      )
      .catch(e => {});

    if (res == null) {
      console.log('paso req fail');
      await noti('paso req fail');
      return;
    }

    const doc = parse(res.data);
    const box = doc.querySelectorAll('.el-content-box--plain');

    const result = Array.from(box).reduce((accumulator, ele) => {
      try {
        const job_num = ele.querySelector('.job-num').textContent;

        accumulator.push(job_num);
        return accumulator;
      } catch (error) {
        return accumulator;
      }
    }, []);

    // データ挿入
    await query('UPDATE pasonahs SET text = ? WHERE id = ?', [
      JSON.stringify(result),
      1,
    ]);

    // 差分を取る
    const diff = result.filter(i => before.indexOf(i) == -1);

    if (diff.length === 0) {
      return;
    }

    // 通知
    for (let value of diff) {
      await noti(value);
      console.log('pasono: ' + value);
    }
  } catch (error) {
  } finally {
    connection.end();
  }
};
