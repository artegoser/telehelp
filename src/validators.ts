import { ValidationResult, Validator } from "./form";

export function string(): Validator<string> {
  return (input: string) => ({ value: input });
}

export function number(): Validator<number> {
  return (input: string) => {
    const value = parseFloat(input);
    if (isNaN(value)) {
      return { errorMessage: "Invalid number format." };
    }

    return { value };
  };
}

export function email(): Validator<string> {
  return (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      return { errorMessage: "Invalid email format." };
    }
    return { value: input };
  };
}
