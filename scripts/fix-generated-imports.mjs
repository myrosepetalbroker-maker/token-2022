#!/usr/bin/env node
/**
 * Fix imports in generated files
 * 
 * This script patches the Codama-generated associatedToken.ts file to use
 * the correct import path (@solana/kit instead of @solana/web3.js).
 * 
 * Run this after generating clients with: npm run generate:clients
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
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

// Files that need fixing (all generated error files in js client)
const filesToFix = [
  filePath,
  // Add other potential files if needed in the future
];

let fixedCount = 0;
let alreadyCorrect = 0;

try {
  console.log('🦊 Fixing generated import paths...');
  
  for (const targetFile of filesToFix) {
    if (!existsSync(targetFile)) {
      continue;
    }
    
    let content = readFileSync(targetFile, 'utf8');
    
    // Replace @solana/web3.js with @solana/kit (for js client)
    const originalContent = content;
    content = content.replace(
      /(} from ['"])@solana\/web3\.js(['"];)/g,
      "$1@solana/kit$2"
    );
    
    if (content !== originalContent) {
      writeFileSync(targetFile, content, 'utf8');
      const fileName = targetFile.split('/').pop();
      console.log(`✅ Fixed import path in ${fileName}`);
      console.log('   Changed: @solana/web3.js → @solana/kit');
      fixedCount++;
    } else {
      alreadyCorrect++;
    }
  }
  
  if (fixedCount === 0) {
    console.log('✅ All import paths already correct');
  } else {
    console.log(`\n✅ Fixed ${fixedCount} file(s)`);
  }
} catch (error) {
  console.error('❌ Error fixing imports:', error.message);
  process.exit(1);
}
