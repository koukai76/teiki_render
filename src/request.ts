import axios from 'axios';
import { parse } from 'node-html-parser';

export const request = async (params: { url: string; name: string }) => {
  const res = await axios.get(params.url, {
    params: {},
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
    },
  });

  if (res.status !== 200) {
    throw new Error(`${params.name} リクエスト失敗`);
  }

  return parse(res.data);
};
