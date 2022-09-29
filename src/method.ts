import { diff } from './diff';
import { read, update } from './firebase';

export const method = async (params: {
  id: string;
  data: any;
  name: string;
}) => {
  const ret = await diff(await read(params.id), params.data);

  if (ret.length === 0) {
    await update(params.id, params.data);
    return;
  }

  await update(params.id, params.data);

  const body = ret.reduce((accumulator, value) => {
    accumulator += value.title.substring(0, 25) + '\n';
    return accumulator;
  }, '');

  console.log(params.name);
  console.log(body);
  console.log();

  return ret.reduce((accumulator, value) => {
    accumulator[value.href] = {
      title: value.title,
      href: value.href,
      time: new Date().getTime(),
    };
    return accumulator;
  }, {});
};
