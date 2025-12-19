"""
In-place Database Migration Script
Updates data/kodescru.db with new schema columns
"""

import sqlite3
from datetime import datetime

DB_PATH = "data/kodescru.db"

def migrate_in_place():
    """Add missing columns to existing database"""
    
    print(f"🔄 Migrating database: {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Get current schema
        cursor.execute("PRAGMA table_info(users)")
        existing_columns = {row[1] for row in cursor.fetchall()}
        print(f"✅ Existing columns: {existing_columns}")
        
        # Add missing columns
        columns_to_add = [
            ("first_name", "VARCHAR"),
            ("last_name", "VARCHAR"),
            ("auth_provider", "VARCHAR DEFAULT 'local'"),
            ("provider_id", "VARCHAR"),
            ("is_active", "BOOLEAN DEFAULT 1"),
            ("is_verified", "BOOLEAN DEFAULT 0"),
            ("updated_at", "DATETIME"),
            ("last_login", "DATETIME"),
        ]
        
        added_count = 0
        for col_name, col_type in columns_to_add:
            if col_name not in existing_columns:
                print(f"➕ Adding column: {col_name} ({col_type})")
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                added_count += 1
            else:
                print(f"⏭️  Column already exists: {col_name}")
        
        # Update existing rows with default values if needed
        if added_count > 0:
            cursor.execute("""
                UPDATE users 
                SET 
                    auth_provider = COALESCE(auth_provider, 'local'),
                    is_active = COALESCE(is_active, 1),
                    is_verified = COALESCE(is_verified, 0),
                    updated_at = COALESCE(updated_at, ?)
                WHERE auth_provider IS NULL OR is_active IS NULL
            """, (datetime.utcnow().isoformat(),))
        
        conn.commit()
        print(f"\n✅ Migration complete! Added {added_count} columns")
        
        # Verify final schema
        cursor.execute("PRAGMA table_info(users)")
        final_columns = [row[1] for row in cursor.fetchall()]
        print(f"📊 Final schema ({len(final_columns)} columns): {', '.join(final_columns)}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_in_place()
