export const validateUserInput = (name: string, email: string) => {
  if (!name || !email) {
    return { valid: false, message: "Name and email are required" };
  }
  return { valid: true };
};
