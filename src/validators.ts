import { ValidationResult, Validator } from "./form";

export function string(): Validator<string> {
  return (input: string) => ({ value: input });
}

export function number({
  errorMessage = "Invalid number format.",
}): Validator<number> {
  return (input: string) => {
    const value = parseFloat(input);
    if (isNaN(value)) {
      return { errorMessage };
    }

    return { value };
  };
}

export function integer({
  errorMessage = "Invalid integer format.",
}): Validator<number> {
  return (input: string) => {
    const value = parseInt(input, 10);
    if (isNaN(value)) {
      return { errorMessage };
    }

    return { value };
  };
}

export function email({
  errorMessage = "Invalid email format.",
}): Validator<string> {
  return (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      return { errorMessage };
    }
    return { value: input };
  };
}
