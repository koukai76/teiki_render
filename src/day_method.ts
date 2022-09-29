import { read, update } from './firebase';

export const day_method = async (params: { data: any; key: string }) => {
  if (params.data == null) {
    return;
  }

  const read_data = await read(params.key);

  if (read_data.length == 0) {
    await update(params.key, params.data);
    return;
  }

  await update(params.key, { ...read_data, ...params.data });
};
