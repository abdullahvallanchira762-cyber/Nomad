export const getUserStorageKey = (prefix, userId) => {
  if (!userId) return null;

  return `${prefix}_${userId}`;
};