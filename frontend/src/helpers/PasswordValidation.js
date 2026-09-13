export const PASSWORD_RULES = [
  {
    label: "At least 6 characters needed",
    test: (value) => value?.length >= 6,
  },
  {
    label: "At least one capital letter needed",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: "At least one number needed",
    test: (value) => /\d/.test(value),
  },
];

export const passwordFieldValidation = (_, value) => {
  if (!value) {
    return Promise.reject(new Error("Password is required!"));
  }

  const failedRule = PASSWORD_RULES.find(
    (rule) => !rule.test(value)
  );

  if (failedRule) {
    return Promise.reject(new Error(failedRule.label));
  }

  return Promise.resolve();
};