#!/bin/bash

# BioMath Core - Database Backup Script
# This script creates a backup of your Supabase database

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="./backups"
PROJECT_REF="txnwvaqzmtlhefcxilfu"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}BioMath Core Database Backup${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

# Check if logged in
echo -e "${YELLOW}Checking Supabase authentication...${NC}"
if ! supabase projects list &> /dev/null; then
    echo -e "${RED}Not logged in to Supabase${NC}"
    echo ""
    echo "Please run: supabase login"
    exit 1
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Link to project if not already linked
echo -e "${YELLOW}Linking to project...${NC}"
if [ ! -f ".supabase/config.toml" ]; then
    supabase link --project-ref "$PROJECT_REF"
fi
echo -e "${GREEN}✓ Project linked${NC}"
echo ""

# Create full backup
echo -e "${YELLOW}Creating full database backup...${NC}"
BACKUP_FILE="$BACKUP_DIR/full-backup-$TIMESTAMP.sql"
supabase db dump -f "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    # Compress the backup
    echo -e "${YELLOW}Compressing backup...${NC}"
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"

    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Full backup created: $BACKUP_FILE ($SIZE)${NC}"
else
    echo -e "${RED}✗ Backup failed${NC}"
    exit 1
fi
echo ""

# Create schema-only backup
echo -e "${YELLOW}Creating schema backup...${NC}"
SCHEMA_FILE="$BACKUP_DIR/schema-backup-$TIMESTAMP.sql"
supabase db dump --schema-only -f "$SCHEMA_FILE"

if [ -f "$SCHEMA_FILE" ]; then
    gzip "$SCHEMA_FILE"
    SCHEMA_FILE="$SCHEMA_FILE.gz"
    SIZE=$(du -h "$SCHEMA_FILE" | cut -f1)
    echo -e "${GREEN}✓ Schema backup created: $SCHEMA_FILE ($SIZE)${NC}"
fi
echo ""

# Create data-only backup
echo -e "${YELLOW}Creating data backup...${NC}"
DATA_FILE="$BACKUP_DIR/data-backup-$TIMESTAMP.sql"
supabase db dump --data-only -f "$DATA_FILE"

if [ -f "$DATA_FILE" ]; then
    gzip "$DATA_FILE"
    DATA_FILE="$DATA_FILE.gz"
    SIZE=$(du -h "$DATA_FILE" | cut -f1)
    echo -e "${GREEN}✓ Data backup created: $DATA_FILE ($SIZE)${NC}"
fi
echo ""

# Create migrations backup
echo -e "${YELLOW}Backing up migrations...${NC}"
if [ -d "supabase/migrations" ]; then
    MIGRATIONS_FILE="$BACKUP_DIR/migrations-backup-$TIMESTAMP.tar.gz"
    tar -czf "$MIGRATIONS_FILE" supabase/migrations/
    SIZE=$(du -h "$MIGRATIONS_FILE" | cut -f1)
    echo -e "${GREEN}✓ Migrations backed up: $MIGRATIONS_FILE ($SIZE)${NC}"
fi
echo ""

# Create backup manifest
MANIFEST_FILE="$BACKUP_DIR/manifest-$TIMESTAMP.txt"
cat > "$MANIFEST_FILE" << EOF
BioMath Core Database Backup Manifest
=====================================

Date: $(date)
Project: $PROJECT_REF
Version: v1.0.0-pre-optimization

Files Created:
- $(basename "$BACKUP_FILE")
- $(basename "$SCHEMA_FILE")
- $(basename "$DATA_FILE")
- $(basename "$MIGRATIONS_FILE")

MD5 Checksums:
$(md5sum "$BACKUP_FILE" 2>/dev/null || echo "N/A")
$(md5sum "$SCHEMA_FILE" 2>/dev/null || echo "N/A")
$(md5sum "$DATA_FILE" 2>/dev/null || echo "N/A")
$(md5sum "$MIGRATIONS_FILE" 2>/dev/null || echo "N/A")

Notes:
Stable backup before optimization phase.
All backups are gzip compressed.

Restore Instructions:
1. Uncompress: gunzip <backup-file>.gz
2. Restore: psql [CONNECTION_STRING] < <backup-file>.sql
   OR: supabase db reset --linked && supabase db push

EOF

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}Backup Complete!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "Backup location: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "Manifest: ${YELLOW}$MANIFEST_FILE${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy backups to external storage"
echo "2. Upload to cloud storage (Google Drive, etc.)"
echo "3. Verify backup integrity"
echo ""
echo -e "${GREEN}Done!${NC}"
