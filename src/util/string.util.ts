export const dot2object = (text: string, withValue?: Record<string, any>) => {
  if (text?.length === 0) {
    return null;
  }

  if (text.indexOf('.') < 0) {
    return { [text]: withValue || {} };
  }

  return {
    [text.substring(0, text.indexOf('.'))]: dot2object(
      text.substring(text.indexOf('.') + 1),
      withValue,
    ),
  };
};
