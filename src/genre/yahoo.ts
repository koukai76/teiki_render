import moment from 'moment-timezone';

import { request } from '../request';
import { method } from '../method';
import { day_method } from '../day_method';

export const yahoo = async () => {
  const doc = await request({ url: 'https://www.yahoo.co.jp', name: 'yahoo' });
  const data = Array.from(
    doc.querySelectorAll('main article section ul')[0].querySelectorAll('li')
  ).map(m => {
    return {
      title: m.querySelector('span').textContent,
      href: m.querySelector('a').getAttribute('href'),
    };
  });

  const ret = await method({ name: 'yahoo', id: 'YAHOO', data: data });

  const now = moment(new Date());
  now.tz('Asia/Tokyo').format('ha z');
  const day = now.format('YYYY-MM-DD');

  await day_method({
    key: `YAHOO_DAY_${day}`,
    data: ret,
  });
};
