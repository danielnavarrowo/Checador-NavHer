//File to replace environment variables in environment.prod.ts with the values from Vercel

const fs = require('fs');
const path = require('path');

// Path to environment.prod.ts
const filePath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read environment variables from Vercel (or default to empty strings)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Create the content for environment.prod.ts
const content = `
export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

// Ensure the environments folder exists
const dirPath = path.dirname(filePath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write the content to environment.prod.ts
fs.writeFileSync(filePath, content);
console.log('Environment variables replaced successfully in environment.prod.ts');
