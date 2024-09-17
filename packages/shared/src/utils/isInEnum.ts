export const isInEnum = (inputStr: string, enumType: any): boolean => {
  return Object.values(enumType).includes(inputStr);
};
