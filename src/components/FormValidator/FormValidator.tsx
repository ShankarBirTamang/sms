import { useState } from "react";

interface ValidationRule {
  [field: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => string | null;
  };
}

interface ValidationErrors {
  [field: string]: string;
}

const FormValidator = <T extends Record<string, undefined>>(
  initialValues: T,
  rules: ValidationRule
) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: string) => {
    const fieldRules = rules[name];
    if (!fieldRules) return;

    let error = "";

    if (fieldRules.required && !value) {
      error = `${name} is required`;
    } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
      error = `${name} must be at least ${fieldRules.minLength} characters`;
    } else if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      error = `${name} must not exceed ${fieldRules.maxLength} characters`;
    } else if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      error = `${name} is invalid`;
    } else if (fieldRules.customValidator) {
      const customError = fieldRules.customValidator(value);
      if (customError) error = customError;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    Object.keys(rules).forEach((field) => {
      const value = formData[field] || "";
      validateField(field, String(value));
      if (errors[field]) newErrors[field] = errors[field];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (rules[name]) validateField(name, value);
  };

  return { formData, errors, setFormData, handleInputChange, validateForm };
};

export default FormValidator;
