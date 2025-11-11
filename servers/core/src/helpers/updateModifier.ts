export const updateModifier = <T>(
  data: T,
  userId: string,
  create?: boolean
) => {
  if (create) {
    return {
      ...data,
      created_by: userId,
      updated_by: userId,
    };
  }

  return {
    ...data,
    updated_by: userId,
  };
};
