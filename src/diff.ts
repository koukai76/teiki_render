import _ from 'lodash';

export const diff = async (before: any, after: any): Promise<any[]> => {
  return _.differenceWith(after, before, (objValue, othValue) => {
    if (objValue.href === othValue.href) {
      return true;
    }
  });
};
