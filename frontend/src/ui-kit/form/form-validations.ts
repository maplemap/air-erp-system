export const validateEmailAddress = (value: string): string | null => {
  const isEmail = /\S+@\S+\.\S+/;
  return isEmail.test(value) ? null : 'Please specify a valid email address';
};

type ValidateLengthParams = {
  fieldName: string;
  value: string;
  length?: number;
};
export const validateLength = ({
  fieldName,
  value,
  length = 3,
}: ValidateLengthParams): string | null =>
  value.length >= length
    ? null
    : `${fieldName} should be at least ${length} characters`;

type ValidateConfirmValues = {
  password: string;
};

export const validateConfirmPassword = (
  value: string,
  values: ValidateConfirmValues,
): string | null => {
  const fieldName = 'Confirm password';
  const errorMessage = validateLength({value, fieldName});

  return !errorMessage && value === values.password
    ? null
    : `${fieldName} should be the same as Password`;
};
