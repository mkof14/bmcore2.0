#!/bin/bash

# BioMath Core - Release Creation Script
# Creates a tagged release with all necessary backups

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

VERSION="v1.0.0-pre-optimization"
RELEASE_DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}BioMath Core - Release Creation${NC}"
echo -e "${BLUE}Version: $VERSION${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
    echo ""
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build
dist
dist-ssr
*.local

# Environment
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Backups
backups/
*.backup
*.bak

# Logs
logs
*.log

# OS
.DS_Store
Thumbs.db
EOF
    echo -e "${GREEN}✓ .gitignore created${NC}"
    echo ""
fi

# Stage all files
echo -e "${YELLOW}Staging files...${NC}"
git add .
echo -e "${GREEN}✓ Files staged${NC}"
echo ""

# Check if there are changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}No changes to commit${NC}"
else
    # Create commit
    echo -e "${YELLOW}Creating commit...${NC}"
    git commit -m "feat: $VERSION - Complete BioMath Core before optimization

This release includes:
- Full authentication system (Supabase)
- Subscription management (3 tiers)
- Payment infrastructure (mock)
- Email system (38 templates)
- AI Health Assistant v2
- Second Opinion system
- Reports engine
- Device integration structure
- Admin panel
- Member zone (14 sections)
- Blog/News CMS
- Legal pages (GDPR, HIPAA, Privacy)
- Vercel deployment configuration

Database:
- 60 tables
- 23 migrations
- Full RLS policies

Status: Ready for optimization phase
Next: SEO, UX improvements, external API integration"

    echo -e "${GREEN}✓ Commit created${NC}"
    echo ""
fi

# Create tag
echo -e "${YELLOW}Creating tag: $VERSION${NC}"
if git tag -l | grep -q "$VERSION"; then
    echo -e "${RED}Tag $VERSION already exists. Removing old tag...${NC}"
    git tag -d "$VERSION"
fi

git tag -a "$VERSION" -m "Release $VERSION - Pre-optimization stable version

Release Date: $RELEASE_DATE
Code Lines: ~15,500
Components: 52+
Database Tables: 60

This is a stable checkpoint before starting the optimization phase.

Features:
✅ Core platform complete
✅ Authentication & authorization
✅ Subscription system
✅ Member zone
✅ Admin panel
✅ Content management
✅ Legal compliance structure

Next Phase:
🔄 SEO optimization
🔄 UX improvements
🔄 External API integration (Stripe, OpenAI, Email providers)
🔄 Performance optimization
🔄 Testing & QA"

echo -e "${GREEN}✓ Tag created: $VERSION${NC}"
echo ""

# Create backup branch
BACKUP_BRANCH="backup/$VERSION"
echo -e "${YELLOW}Creating backup branch: $BACKUP_BRANCH${NC}"
if git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
    echo -e "${YELLOW}Backup branch already exists${NC}"
else
    git branch "$BACKUP_BRANCH"
    echo -e "${GREEN}✓ Backup branch created${NC}"
fi
echo ""

# Show current status
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Release Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Version:${NC} $VERSION"
echo -e "${GREEN}Branch:${NC} $(git branch --show-current)"
echo -e "${GREEN}Backup Branch:${NC} $BACKUP_BRANCH"
echo -e "${GREEN}Commit:${NC} $(git rev-parse --short HEAD)"
echo ""

# Show tags
echo -e "${YELLOW}Available tags:${NC}"
git tag -l
echo ""

# Instructions
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Next Steps${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}1. Push to GitHub:${NC}"
echo "   git remote add origin https://github.com/YOUR_USERNAME/biomathcore.git"
echo "   git push -u origin main"
echo "   git push origin $VERSION"
echo "   git push origin $BACKUP_BRANCH"
echo ""
echo -e "${YELLOW}2. Create database backup:${NC}"
echo "   ./scripts/backup-database.sh"
echo ""
echo -e "${YELLOW}3. Create local archive:${NC}"
echo "   tar -czf biomath-core-$VERSION-$TIMESTAMP.tar.gz \\"
echo "     --exclude='node_modules' \\"
echo "     --exclude='dist' \\"
echo "     --exclude='.env' \\"
echo "     ."
echo ""
echo -e "${YELLOW}4. Verify backup:${NC}"
echo "   - Check GitHub repository"
echo "   - Verify tag is visible"
echo "   - Test database restore"
echo ""
echo -e "${GREEN}Release created successfully!${NC}"
echo ""
