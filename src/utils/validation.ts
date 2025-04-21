
// Email validation
export const isValidEmail = (email: string): boolean => {
  const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  return gmailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 6 characters, 1 lowercase, 1 uppercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (10 digits)
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

// Name validation (at least 3 characters)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 3;
};

// Form validation helpers
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 6) strength += 1;
  if (password.length >= 8) strength += 1;
  
  // Character type checks
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*]/.test(password)) strength += 1;
  
  return Math.min(strength, 5); // Max strength of 5
};

export const getPasswordFeedback = (password: string): string => {
  const strength = getPasswordStrength(password);
  
  switch (strength) {
    case 0: return "Enter a password";
    case 1: return "Very weak";
    case 2: return "Weak";
    case 3: return "Moderate";
    case 4: return "Strong";
    case 5: return "Very strong";
    default: return "";
  }
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
