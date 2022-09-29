import moment from 'moment';
import axios from 'axios';
import formData from 'form-data';
import cheerio from 'cheerio';

import { notification } from '../notification';

const login = async () => {
  let res = await axios.get(`http://drrrkari.com`, {
    params: {},
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    },
  });

  if (res.status !== 200) {
    throw new Error('');
  }

  const _$ = cheerio.load(res.data);
  const _form = new formData();

  _form.append('token', _$('input[name="token"]').val());
  _form.append('name', '名無し');
  _form.append('icon', 'girl');
  _form.append('language', 'ja-JP');
  _form.append('login', 'login');

  res = await axios.post(`http://drrrkari.com`, _form, {
    headers: {
      ..._form.getHeaders(),
      Cookie: res.headers['set-cookie'] as unknown as string,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    },
  });

  return res.data;
};

const getData = html => {
  const _$ = cheerio.load(html);
  return _$('#zatsu .name')
    .map(function (i) {
      return {
        room_name: _$('#zatsu .name').eq(i).text(),
        member: _$('#zatsu .users ul')
          .eq(i)
          .find('li')
          .map(function (j, mm) {
            return _$('#zatsu .users ul').eq(i).find('li').eq(j).text();
          })
          .get(),
      };
    })
    .get();
};

export const drrr = async (params: { TARGET: string }) => {
  const hour = moment().hours();

  const html = await login();
  const data = await getData(html);

  for (let room of data) {
    for (let name of room.member) {
      if (name === params.TARGET) {
        await notification('drrr追跡ボット', room.room_name, [
          process.env.EXPO_ID,
          process.env.EXPO_ID2,
        ]);
      }
    }
  }

  if (hour === 1 && moment().minutes() >= 50) {
    await notification('drrr追跡ボット', '探索終了', [
      // process.env.EXPO_ID,
      process.env.EXPO_ID2,
    ]);
  }
};
