/** Shared rules aligned with student signup / login screens */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GRADIENT_DOMAIN_REGEX = /^[^\s@]+@gradient\.com$/i;
const SPECIAL_CHAR_REGEX = /[ #@$!%*?&]/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;

export function validateStudentLoginPassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Minimum 6 characters required.";
  if (!SPECIAL_CHAR_REGEX.test(password))
    return "Add a special character (@$!%*?&).";
  return "";
}

export function validateStudentSignupPassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Minimum 8 characters required.";
  if (!SPECIAL_CHAR_REGEX.test(password))
    return "Add a special character (@$!%*?&).";
  return "";
}

export function validatePortalAdminEmail(email) {
  const trimmed = String(email ?? "").trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  if (!GRADIENT_DOMAIN_REGEX.test(trimmed))
    return "Administrator email must end with @gradient.com";
  return "";
}

export function validateStudentEmail(email) {
  const trimmed = String(email ?? "").trim();
  if (!trimmed) return "Email is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  return "";
}

export function validatePortalAdminName(value, fieldLabel) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return `${fieldLabel} is required.`;
  if (!NAME_REGEX.test(trimmed)) return "Only letters (A-Z) allowed.";
  if (trimmed.length < 2) return "Minimum 2 characters required.";
  return "";
}
