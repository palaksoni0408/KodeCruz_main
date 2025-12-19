"""
Database Migration Script
Migrates existing users from old schema to new schema
"""

import sqlite3
import os
from datetime import datetime

# Database paths
OLD_DB = "data/kodescru.db"
NEW_DB = "kodescruxx.db"

def migrate_database():
    """Migrate users from old database to new database schema"""
    
    print("🔄 Starting database migration...")
    
    # Check if old database exists
    if not os.path.exists(OLD_DB):
        print(f"❌ Old database not found at {OLD_DB}")
        print("✅ No migration needed - will create fresh database")
        return
    
    # Connect to both databases
    old_conn = sqlite3.connect(OLD_DB)
    new_conn = sqlite3.connect(NEW_DB)
    
    old_cursor = old_conn.cursor()
    new_cursor = new_conn.cursor()
    
    try:
        # Get existing users from old database
        old_cursor.execute("SELECT id, username, email, hashed_password, created_at FROM users")
        old_users = old_cursor.fetchall()
        
        if not old_users:
            print("ℹ️  No users found in old database")
            return
        
        print(f"📊 Found {len(old_users)} users in old database")
        
        # Create new users table with full schema
        new_cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR NOT NULL PRIMARY KEY,
                email VARCHAR UNIQUE,
                username VARCHAR UNIQUE,
                first_name VARCHAR,
                last_name VARCHAR,
                hashed_password VARCHAR,
                auth_provider VARCHAR DEFAULT 'local',
                provider_id VARCHAR,
                is_active BOOLEAN DEFAULT 1,
                is_verified BOOLEAN DEFAULT 0,
                created_at DATETIME,
                updated_at DATETIME,
                last_login DATETIME
            )
        """)
        
        # Create indexes
        new_cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email)")
        new_cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users (username)")
        new_cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_id ON users (id)")
        
        # Migrate each user
        migrated_count = 0
        for user in old_users:
            user_id, username, email, hashed_password, created_at = user
            
            try:
                new_cursor.execute("""
                    INSERT INTO users (
                        id, email, username, hashed_password, 
                        auth_provider, is_active, is_verified,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id,
                    email,
                    username,
                    hashed_password,
                    'local',  # Default auth_provider
                    1,        # is_active = True
                    0,        # is_verified = False
                    created_at or datetime.utcnow().isoformat(),
                    datetime.utcnow().isoformat()
                ))
                migrated_count += 1
            except sqlite3.IntegrityError as e:
                print(f"⚠️  Skipping duplicate user: {email or username} - {e}")
                continue
        
        # Commit changes
        new_conn.commit()
        print(f"✅ Successfully migrated {migrated_count} users")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        new_conn.rollback()
        raise
    finally:
        old_conn.close()
        new_conn.close()

def create_fresh_database():
    """Create a fresh database with proper schema"""
    print("🆕 Creating fresh database...")
    
    conn = sqlite3.connect(NEW_DB)
    cursor = conn.cursor()
    
    try:
        # Drop existing table if needed
        cursor.execute("DROP TABLE IF EXISTS users")
        
        # Create users table with full schema
        cursor.execute("""
            CREATE TABLE users (
                id VARCHAR NOT NULL PRIMARY KEY,
                email VARCHAR UNIQUE,
                username VARCHAR UNIQUE,
                first_name VARCHAR,
                last_name VARCHAR,
                hashed_password VARCHAR,
                auth_provider VARCHAR DEFAULT 'local',
                provider_id VARCHAR,
                is_active BOOLEAN DEFAULT 1,
                is_verified BOOLEAN DEFAULT 0,
                created_at DATETIME,
                updated_at DATETIME,
                last_login DATETIME
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE UNIQUE INDEX ix_users_email ON users (email)")
        cursor.execute("CREATE UNIQUE INDEX ix_users_username ON users (username)")
        cursor.execute("CREATE INDEX ix_users_id ON users (id)")
        
        conn.commit()
        print("✅ Fresh database created successfully")
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--fresh":
        # Create fresh database (destructive)
        create_fresh_database()
    else:
        # Try to migrate existing data
        migrate_database()
    
    print("\n✅ Database is ready!")
    print(f"📍 Database location: {NEW_DB}")
