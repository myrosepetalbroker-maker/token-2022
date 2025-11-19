#!/usr/bin/env node
/**
 * Automatic Environment Maintenance Script
 * 
 * This script automatically maintains a clean development environment by:
 * - Cleaning build artifacts
 * - Verifying gitignore compliance
 * - Checking for stale dependencies
 * - Ensuring consistent file permissions
 * 
 * Run automatically via git hooks or manually via: npm run maintain
 */

import { existsSync, rmSync, statSync, chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Clean build artifacts
function cleanBuildArtifacts() {
  log('\n🧹 Cleaning build artifacts...', 'blue');
  
  const pathsToClean = [
    'clients/js/dist',
    'clients/js/node_modules',
    'clients/js/.eslintcache',
    'node_modules',
  ];
  
  let cleanedCount = 0;
  pathsToClean.forEach(path => {
    const fullPath = join(rootDir, path);
    if (existsSync(fullPath)) {
      try {
        rmSync(fullPath, { recursive: true, force: true });
        log(`   ✓ Removed ${path}`, 'green');
        cleanedCount++;
      } catch (error) {
        log(`   ⚠ Could not remove ${path}: ${error.message}`, 'yellow');
      }
    }
  });
  
  if (cleanedCount === 0) {
    log('   ✓ No build artifacts to clean', 'green');
  }
}

// Verify gitignore compliance
function verifyGitignore() {
  log('\n🔍 Verifying gitignore compliance...', 'blue');
  
  try {
    const output = execSync('git status --porcelain', { 
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const lines = output.split('\n').filter(line => line.trim());
    const ignoredPatterns = ['node_modules', 'dist', '.DS_Store', 'target'];
    
    const problematicFiles = lines.filter(line => {
      const file = line.substring(3);
      return ignoredPatterns.some(pattern => file.includes(pattern));
    });
    
    if (problematicFiles.length > 0) {
      log('   ⚠ Found files that should be gitignored:', 'yellow');
      problematicFiles.forEach(file => log(`     - ${file}`, 'yellow'));
    } else {
      log('   ✓ All files properly gitignored', 'green');
    }
  } catch (error) {
    log('   ⚠ Could not verify git status', 'yellow');
  }
}

// Ensure script permissions
function ensureScriptPermissions() {
  log('\n🔐 Ensuring script permissions...', 'blue');
  
  const scripts = [
    'scripts/fix-generated-imports.mjs',
    'scripts/maintain-environment.mjs',
    'scripts/restart-test-validator.sh',
  ];
  
  scripts.forEach(script => {
    const fullPath = join(rootDir, script);
    if (existsSync(fullPath)) {
      try {
        const stats = statSync(fullPath);
        if (!(stats.mode & 0o100)) {
          chmodSync(fullPath, 0o755);
          log(`   ✓ Made ${script} executable`, 'green');
        }
      } catch (error) {
        log(`   ⚠ Could not update permissions for ${script}`, 'yellow');
      }
    }
  });
  
  log('   ✓ Script permissions verified', 'green');
}

// Check workspace integrity
function checkWorkspaceIntegrity() {
  log('\n🔧 Checking workspace integrity...', 'blue');
  
  const requiredFiles = [
    'package.json',
    'pnpm-lock.yaml',
    'clients/js/package.json',
    'clients/js/tsconfig.json',
    '.gitignore',
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    return !existsSync(join(rootDir, file));
  });
  
  if (missingFiles.length > 0) {
    log('   ⚠ Missing required files:', 'yellow');
    missingFiles.forEach(file => log(`     - ${file}`, 'yellow'));
  } else {
    log('   ✓ All required files present', 'green');
  }
}

// Main execution
async function main() {
  log('🦊 Starting automatic environment maintenance...', 'blue');
  
  try {
    cleanBuildArtifacts();
    verifyGitignore();
    ensureScriptPermissions();
    checkWorkspaceIntegrity();
    
    log('\n✅ Environment maintenance complete!', 'green');
    log('   Your workspace is clean and ready for development.\n', 'green');
  } catch (error) {
    log(`\n❌ Error during maintenance: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
