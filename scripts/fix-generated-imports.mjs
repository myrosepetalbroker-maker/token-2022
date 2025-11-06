#!/usr/bin/env node
/**
 * Fix imports in generated files
 * 
 * This script patches the Codama-generated associatedToken.ts file to use
 * the correct import path (@solana/kit instead of @solana/web3.js).
 * 
 * Run this after generating clients with: npm run generate:clients
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(
  __dirname,
  '..',
  'clients',
  'js',
  'src',
  'generated',
  'errors',
  'associatedToken.ts'
);

try {
  console.log('🦊 Fixing generated import paths...');
  
  let content = readFileSync(filePath, 'utf8');
  
  // Replace @solana/web3.js with @solana/kit
  const originalContent = content;
  content = content.replace(
    "} from '@solana/web3.js';",
    "} from '@solana/kit';"
  );
  
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed import path in associatedToken.ts');
    console.log('   Changed: @solana/web3.js → @solana/kit');
  } else {
    console.log('✅ Import path already correct');
  }
} catch (error) {
  console.error('❌ Error fixing imports:', error.message);
  process.exit(1);
}
