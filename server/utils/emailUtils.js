/**
 * Email utility functions for consistent email handling
 */

/**
 * Normalize email address for consistent comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Validate format
 * @param {string} email - Email address to normalize
 * @returns {string|null} Normalized email or null if invalid
 */
const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  // Trim whitespace and convert to lowercase
  const normalized = email.trim().toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return null;
  }
  
  return normalized;
};

/**
 * Check if two emails are equivalent (case-insensitive)
 * @param {string} email1 - First email
 * @param {string} email2 - Second email
 * @returns {boolean} True if emails are equivalent
 */
const areEmailsEquivalent = (email1, email2) => {
  const norm1 = normalizeEmail(email1);
  const norm2 = normalizeEmail(email2);
  
  return norm1 && norm2 && norm1 === norm2;
};

/**
 * Create case-insensitive email query
 * @param {string} email - Email to create query for
 * @returns {Object} MongoDB query object
 */
const createEmailQuery = (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error('Invalid email format');
  }
  
  return { 
    email: { $regex: new RegExp(`^${normalized}$`, 'i') } 
  };
};

/**
 * Sanitize email for logging (hide part of the address)
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
const sanitizeEmailForLogging = (email) => {
  if (!email || typeof email !== 'string') return '[invalid]';
  
  const parts = email.split('@');
  if (parts.length !== 2) return '[invalid]';
  
  const username = parts[0];
  const domain = parts[1];
  
  // Hide middle characters of username
  if (username.length <= 2) {
    return `${'*'.repeat(username.length)}@${domain}`;
  }
  
  const visibleStart = username.substring(0, 1);
  const visibleEnd = username.substring(username.length - 1);
  const hiddenMiddle = '*'.repeat(Math.max(0, username.length - 2));
  
  return `${visibleStart}${hiddenMiddle}${visibleEnd}@${domain}`;
};

module.exports = {
  normalizeEmail,
  areEmailsEquivalent,
  createEmailQuery,
  sanitizeEmailForLogging
};