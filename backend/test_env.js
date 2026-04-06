const fs = require('fs');
const dotenv = require('dotenv');

try {
  const result = dotenv.config();
  if (result.error) {
    console.error('Dotenv error:', result.error);
  } else {
    console.log('Dotenv loaded successfully');
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 10) : 'undefined');
  }
} catch (e) {
  console.error('Execution error:', e);
}
