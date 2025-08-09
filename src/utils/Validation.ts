import { ValidationRule, FormField, FormData, ValidationError } from '../types';

/**
 * Validate a single field value against its validation rules
 */
export const validateField = (field: FormField, value: any): string | null => {
  // Skip validation for derived fields as they are computed
  if (field.isDerived) {
    return null;
  }

  for (const rule of field.validationRules) {
    const error = validateRule(rule, value, field.label);
    if (error) {
      return error;
    }
  }

  return null;
};

/**
 * Validate a single rule
 */
export const validateRule = (rule: ValidationRule, value: any, fieldLabel: string): string | null => {
  switch (rule.type) {
    case 'required':
      if (value === undefined || value === null || value === '') {
        return rule.message || `${fieldLabel} is required`;
      }
      break;

    case 'minLength':
      if (value && value.toString().length < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters long`;
      }
      break;

    case 'maxLength':
      if (value && value.toString().length > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters long`;
      }
      break;

    case 'email':
      if (value && !isValidEmail(value.toString())) {
        return rule.message || `${fieldLabel} must be a valid email address`;
      }
      break;

    case 'password':
      if (value && !isValidPassword(value.toString())) {
        return rule.message || `${fieldLabel} must be at least 8 characters long and contain at least one number`;
      }
      break;

    default:
      break;
  }

  return null;
};

/**
 * Validate entire form data
 */
export const validateForm = (fields: FormField[], formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    const value = formData[field.id];
    const error = validateField(field, value);
    
    if (error) {
      errors.push({
        fieldId: field.id,
        message: error,
      });
    }
  });

  return errors;
};

/**
 * Email validation helper
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation helper
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters and contains at least one number
  const passwordRegex = /^(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get default validation rules for different field types
 */
export const getDefaultValidationRules = (fieldType: string): ValidationRule[] => {
  const rules: ValidationRule[] = [];

  switch (fieldType) {
    case 'email':
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address',
      });
      break;

    case 'password':
      rules.push({
        type: 'password',
        message: 'Password must be at least 8 characters long and contain at least one number',
      });
      break;

    default:
      break;
  }

  return rules;
};

/**
 * Create validation rule
 */
export const createValidationRule = (
  type: ValidationRule['type'],
  value?: number | string,
  message?: string
): ValidationRule => {
  return {
    type,
    value,
    message: message || getDefaultMessage(type, value),
  };
};

/**
 * Get default error message for validation rule type
 */
export const getDefaultMessage = (type: ValidationRule['type'], value?: number | string): string => {
  switch (type) {
    case 'required':
      return 'This field is required';
    case 'minLength':
      return `Must be at least ${value} characters long`;
    case 'maxLength':
      return `Must be no more than ${value} characters long`;
    case 'email':
      return 'Please enter a valid email address';
    case 'password':
      return 'Password must be at least 8 characters long and contain at least one number';
    default:
      return 'Invalid value';
  }
};