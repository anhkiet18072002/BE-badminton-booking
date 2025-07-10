export const object2dot = (object: Object): any[] => {
  if (typeof object !== 'object') {
    return [];
  }

  const values: any[] =
    Object.keys(object)?.map((key: string) => {
      if (typeof object[key] === 'object') {
        return object2dot(object[key]);
      }

      return object[key];
    }) || [];

  const flatValues: any[] = values?.reduce((array: any[], value: any) => {
    if (Array.isArray(value)) {
      array = array.concat(value);
    } else {
      array.push(value);
    }

    return array;
  }, []);

  return flatValues;
};
