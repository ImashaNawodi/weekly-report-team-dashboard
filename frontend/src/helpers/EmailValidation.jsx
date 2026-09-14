export const emailFieldValidation = (_, value) => {
  if (!value) {
    return Promise.reject(new Error("Email is required!"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return Promise.reject(
      new Error("Please enter a valid email address")
    );
  }

  return Promise.resolve();
};