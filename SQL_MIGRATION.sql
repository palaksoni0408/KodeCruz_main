-- ============================================
-- Database Migration Script
-- Purpose: Add username field to users table
-- ============================================

-- This script should be run on your Render PostgreSQL database
-- to add the username field to existing users table

-- Step 1: Add username column (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR;

-- Step 2: Create unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users(username);

-- Step 3: Make email column nullable (to allow username-only signups)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Step 4: Update existing users - set username = email for users who don't have username
UPDATE users 
SET username = email 
WHERE username IS NULL AND email IS NOT NULL;

-- Step 5: Verify the changes
SELECT id, email, username, created_at 
FROM users 
LIMIT 10;

-- ============================================
-- Rollback Instructions (if needed)
-- ============================================

-- To rollback (run these if you need to undo):
-- DROP INDEX IF EXISTS ix_users_username;
-- ALTER TABLE users DROP COLUMN IF EXISTS username;
-- ALTER TABLE users ALTER COLUMN email SET NOT NULL;
