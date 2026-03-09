/**
 * Script to help clear authentication tokens in localStorage
 * Run this if you're experiencing authentication issues
 */

console.log('Clearing authentication tokens...');
console.log('Please run this in your browser console:');
console.log(`
localStorage.removeItem('user');
sessionStorage.clear();
console.log('Authentication tokens cleared. Please refresh the page.');
`);

console.log('\nAlternatively, you can manually clear your browser cache and cookies for the site.');