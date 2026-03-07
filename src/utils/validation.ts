/**
 * Input validation utilities for security and data integrity
 * Prevents XSS attacks and ensures data quality
 */

import { VALIDATION_RULES, ERROR_MESSAGES, VIDEO_CONFIG } from '@/constants';
import { ValidationRule, ValidationResult, FormField } from '@/types';

/**
 * Sanitizes HTML input to prevent XSS attacks
 * @param input - Raw input string
 * @returns Sanitized string safe for display
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Basic HTML entity encoding
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns Validation result
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED);
  } else if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    errors.push(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a URL format
 * @param url - URL string to validate
 * @returns Validation result
 */
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url.trim()) {
    errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED);
  } else if (!VALIDATION_RULES.URL.PATTERN.test(url)) {
    errors.push(ERROR_MESSAGES.VALIDATION.INVALID_URL);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates video title
 * @param title - Title string to validate
 * @returns Validation result
 */
export const validateVideoTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  const sanitized = title.trim();

  if (!sanitized) {
    errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED);
  } else if (sanitized.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
    errors.push(ERROR_MESSAGES.VALIDATION.MIN_LENGTH(VALIDATION_RULES.TITLE.MIN_LENGTH));
  } else if (sanitized.length > VALIDATION_RULES.TITLE.MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.VALIDATION.MAX_LENGTH(VALIDATION_RULES.TITLE.MAX_LENGTH));
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates video description
 * @param description - Description string to validate
 * @returns Validation result
 */
export const validateVideoDescription = (description: string): ValidationResult => {
  const errors: string[] = [];
  const sanitized = description.trim();
  
  if (sanitized.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    errors.push(ERROR_MESSAGES.VALIDATION.MAX_LENGTH(VALIDATION_RULES.DESCRIPTION.MAX_LENGTH));
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates file upload
 * @param file - File object to validate
 * @returns Validation result
 */
export const validateVideoFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > VIDEO_CONFIG.MAX_FILE_SIZE) {
    errors.push(ERROR_MESSAGES.VALIDATION.FILE_SIZE);
  }
  
  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !VIDEO_CONFIG.VIDEO.SUPPORTED_FORMATS.includes(fileExtension as any)) {
    errors.push(ERROR_MESSAGES.VALIDATION.FILE_FORMAT);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a form field based on its rules
 * @param field - Form field to validate
 * @returns Validation result
 */
export const validateField = (field: FormField): ValidationResult => {
  const errors: string[] = [];
  const value = field.value.trim();
  
  // Check required
  if (field.rules.find(rule => rule.required) && !value) {
    errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED);
    return { isValid: false, errors };
  }
  
  // Skip other validations if field is empty and not required
  if (!value) {
    return { isValid: true, errors: [] };
  }
  
  // Check minimum length
  const minLengthRule = field.rules.find(rule => rule.minLength);
  if (minLengthRule && value.length < minLengthRule.minLength!) {
    errors.push(ERROR_MESSAGES.VALIDATION.MIN_LENGTH(minLengthRule.minLength!));
  }
  
  // Check maximum length
  const maxLengthRule = field.rules.find(rule => rule.maxLength);
  if (maxLengthRule && value.length > maxLengthRule.maxLength!) {
    errors.push(ERROR_MESSAGES.VALIDATION.MAX_LENGTH(maxLengthRule.maxLength!));
  }
  
  // Check pattern
  const patternRule = field.rules.find(rule => rule.pattern);
  if (patternRule && !patternRule.pattern!.test(value)) {
    errors.push(`Invalid format for ${field.name}.`);
  }
  
  // Check custom validation
  const customRule = field.rules.find(rule => rule.custom);
  if (customRule && !customRule.custom!(value)) {
    errors.push(`Custom validation failed for ${field.name}.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates multiple form fields
 * @param fields - Array of form fields to validate
 * @returns Overall validation result
 */
export const validateForm = (fields: FormField[]): ValidationResult => {
  const allErrors: string[] = [];
  
  fields.forEach(field => {
    const result = validateField(field);
    allErrors.push(...result.errors);
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Debounces validation to avoid excessive validation calls
 * @param validationFn - Validation function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced validation function
 */
export const debounceValidation = <T extends (...args: any[]) => any>(
  validationFn: T,
  delay: number = 300
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => validationFn(...args), delay);
  }) as T;
};

/**
 * Checks if a string contains potentially dangerous content
 * @param input - String to check
 * @returns True if content appears safe
 */
export const isSafeContent = (input: string): boolean => {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Validates and sanitizes user input for safe processing
 * @param input - Raw user input
 * @param options - Validation options
 * @returns Validated and sanitized result
 */
export const validateAndSanitize = (
  input: string,
  options: {
    required?: boolean;
    maxLength?: number;
    allowHtml?: boolean;
  } = {}
): ValidationResult & { sanitized: string } => {
  const errors: string[] = [];
  let sanitized = input.trim();
  
  // Check required
  if (options.required && !sanitized) {
    errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED);
  }
  
  // Check length
  if (options.maxLength && sanitized.length > options.maxLength) {
    errors.push(ERROR_MESSAGES.VALIDATION.MAX_LENGTH(options.maxLength));
  }
  
  // Check for dangerous content
  if (!isSafeContent(sanitized)) {
    errors.push('Content contains potentially unsafe elements.');
  }
  
  // Strip dangerous HTML tags/patterns but do NOT entity-encode.
  // React's JSX handles XSS natively; entity-encoding here would
  // double-encode values stored in the database (e.g. "&" → "&amp;").
  if (!options.allowHtml) {
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<\/?(?:iframe|object|embed|form|input|button)[^>]*>/gi, '');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};