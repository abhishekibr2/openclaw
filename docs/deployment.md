# OpenClaw Deployment Guide

**Production deployment instructions and best practices**

---

## Deployment Overview

OpenClaw can be deployed in several modes:

1. **Local Development** - Single machine, local database
2. **Self-Hosted Production** - VPS/dedicated server, cloud database
3. **Distributed** - Multiple machines for different agents
4. **Containerized** - Docker deployment (future)

---

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ (recommended) or any Linux distro
- **Node.js**: v16.x or higher
- **Memory**: 2GB minimum (4GB recommended for browser automation)
- **CPU**: 2 cores minimum (4 cores recommended)
- **Disk**: 10GB minimum (for Chrome, dependencies, logs)
- **Network**: Stable internet connection for API calls

### External Services

- **Supabase account** (free tier works for development)
- **Telegram bot** (optional, for Telegram interface)
- **LLM API access** (OpenRouter, Qwen Portal, or custom)
- **Email SMTP server** (optional, for email notifications)

---

## Installation Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Google Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update
sudo apt install -y google-chrome-stable

# Install build tools (for native modules)
sudo apt install -y build-essential

# Verify installations
node --version  # Should show v18.x
google-chrome --version
```

### 2. Clone and Setup OpenClaw

```bash
# Create application directory
sudo mkdir -p /opt/openclaw
sudo chown $USER:$USER /opt/openclaw
cd /opt/openclaw

# Clone repository (adjust URL)
git clone https://github.com/abhishekibr2/openclaw.git .

# Install dependencies
npm install

# Install workspace dependencies
cd workspace-dispatcher
npm install
cd ..
```

### 3. Configure Environment

```bash
# Create .env file
cp .env.example .env
nano .env
```

**Required variables**:
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-bot-token

# Email SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Secure the file**:
```bash
chmod 600 .env
```

### 4. Database Setup

#### Option A: Supabase (Recommended)

1. **Create Supabase project** at https://supabase.com
2. **Run schema**:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `schema.sql`
   - Execute query
3. **Verify tables created**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   Should show: `tasks`, `reports`

#### Option B: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE openclaw;
CREATE USER openclaw_user WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE openclaw TO openclaw_user;
\q

# Run schema
psql -U openclaw_user -d openclaw -f schema.sql

# Update .env
POSTGRES_URL=postgresql://openclaw_user:secure-password@localhost:5432/openclaw
```

### 5. Configure OpenClaw

Edit `openclaw.json`:

```json
{
  "browser": {
    "enabled": true,
    "executablePath": "/usr/bin/google-chrome",
    "noSandbox": false,  // ⚠️ Set to false for production!
    "defaultProfile": "openclaw"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/google/gemini-3-flash-preview"
      }
    },
    "list": [
      { "id": "main" },
      { "id": "supervisour", ... },
      { "id": "dispatcher", ... },
      { "id": "executor", ... },
      { "id": "reporter", ... },
      { "id": "notification", ... },
      { "id": "architect", ... }
    ]
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "auth": {
      "mode": "token",
      "token": "CHANGE-THIS-IN-PRODUCTION"  // ⚠️ Generate secure token!
    }
  }
}
```

**Generate secure gateway token**:
```bash
openssl rand -hex 24
# Use output as gateway token
```

### 6. Test Installation

```bash
# Test Supabase connection
cd workspace-dispatcher
npm test

# Expected output:
# {
#   "healthy": true,
#   "supabaseConnected": true
# }

# Test OpenClaw
cd /opt/openclaw
openclaw --version
```

---

## Running in Production

### Option 1: systemd Service (Recommended)

Create service file:

```bash
sudo nano /etc/systemd/system/openclaw.service
```

**Service configuration**:
```ini
[Unit]
Description=OpenClaw Multi-Agent System
After=network.target

[Service]
Type=simple
User=openclaw
WorkingDirectory=/opt/openclaw
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node /opt/openclaw/bin/openclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=openclaw

[Install]
WantedBy=multi-user.target
```

**Create dedicated user**:
```bash
sudo useradd -r -s /bin/false openclaw
sudo chown -R openclaw:openclaw /opt/openclaw
```

**Enable and start**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable openclaw
sudo systemctl start openclaw

# Check status
sudo systemctl status openclaw

# View logs
sudo journalctl -u openclaw -f
```

### Option 2: PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start OpenClaw
pm2 start bin/openclaw --name openclaw -- start

# Enable auto-restart on boot
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs openclaw
```

### Option 3: Docker (Future)

*Docker deployment is planned but not yet implemented.*

---

## Monitoring and Logging

### Application Logs

**systemd**:
```bash
sudo journalctl -u openclaw -f --since "1 hour ago"
```

**PM2**:
```bash
pm2 logs openclaw
```

### Agent Memory Logs

Each agent writes daily logs:

```bash
# Dispatcher logs
cat /opt/openclaw/workspace-dispatcher/memory/$(date +%Y-%m-%d).md

# Supervisor logs
cat /opt/openclaw/workspace-supervisour/memory/$(date +%Y-%m-%d).md

# Executor logs
cat /opt/openclaw/workspace-executor/memory/$(date +%Y-%m-%d).md
```

### Database Monitoring

```sql
-- Task statistics
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status;

-- Recent tasks
SELECT id, title, status, created_at, completed_at
FROM tasks
ORDER BY created_at DESC
LIMIT 10;

-- Task duration analysis
SELECT 
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))::int as avg_seconds
FROM tasks 
WHERE status = 'completed';
```

### Health Checks

**HTTP endpoint**:
```bash
curl http://localhost:18789/health
```

**Database check**:
```bash
cd workspace-dispatcher
npm test
```

---

## Backup and Recovery

### Database Backups

**Supabase** (automatic):
- Point-in-time recovery available
- Daily automated backups
- Download backups from dashboard

**Self-hosted PostgreSQL**:
```bash
# Daily backup cron job
0 2 * * * pg_dump -U openclaw_user openclaw > /backups/openclaw-$(date +\%Y\%m\%d).sql

# Backup with compression
pg_dump -U openclaw_user openclaw | gzip > /backups/openclaw-$(date +%Y%m%d).sql.gz
```

### Configuration Backups

```bash
# Backup critical files
tar -czf openclaw-config-$(date +%Y%m%d).tar.gz \
  .env \
  openclaw.json \
  workspace-*/IDENTITY.md \
  workspace-*/SOUL.md \
  workspace-*/AGENTS.md \
  workspace-*/**/SKILL.md
```

### Memory Logs Backup

```bash
# Archive old memory logs
tar -czf memory-archive-$(date +%Y%m).tar.gz \
  workspace-*/memory/2026-*.md
```

### Restore Procedure

```bash
# 1. Stop service
sudo systemctl stop openclaw

# 2. Restore database
psql -U openclaw_user -d openclaw < /backups/openclaw-20260211.sql

# 3. Restore configuration
tar -xzf openclaw-config-20260211.tar.gz

# 4. Start service
sudo systemctl start openclaw
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS (if using reverse proxy)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct gateway access from internet
# (Only allow from localhost or VPN)
sudo ufw deny 18789/tcp

# Enable firewall
sudo ufw enable
```

### 2. Secure Gateway with Reverse Proxy

**Nginx configuration**:

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/openclaw
```

```nginx
server {
    listen 80;
    server_name openclaw.example.com;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name openclaw.example.com;
    
    ssl_certificate /etc/letsencrypt/live/openclaw.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openclaw.example.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Authorization $http_authorization;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d openclaw.example.com
```

### 4. Environment Variable Security

```bash
# Ensure .env is secure
chmod 600 .env
chown openclaw:openclaw .env

# Never commit .env to git
echo ".env" >> .gitignore
```

### 5. Browser Sandbox

In `openclaw.json`:
```json
{
  "browser": {
    "noSandbox": false  // ⚠️ Always false in production
  }
}
```

---

## Performance Optimization

### 1. Browser Resource Limits

Configure Chrome flags:

```json
{
  "browser": {
    "args": [
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu"
    ]
  }
}
```

### 2. Database Connection Pooling

Supabase handles this automatically. For self-hosted:

```javascript
// In Supabase client config
const supabase = createClient(url, key, {
  db: {
    poolSize: 10  // Adjust based on load
  }
});
```

### 3. Memory Management

```bash
# Monitor memory usage
free -h
htop

# Adjust Node.js heap size if needed
export NODE_OPTIONS="--max-old-space-size=4096"  # 4GB
```

### 4. Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/openclaw
```

```
/opt/openclaw/workspace-*/memory/*.md {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 openclaw openclaw
}
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status openclaw

# View full logs
sudo journalctl -u openclaw -n 100 --no-pager

# Common issues:
# - Port 18789 already in use
# - Missing .env file
# - Invalid openclaw.json
# - Node.js version too old
```

### Browser Automation Fails

```bash
# Verify Chrome installation
google-chrome --version

# Check Chrome can launch headless
google-chrome --headless --disable-gpu --dump-dom https://example.com

# Check noSandbox setting
grep noSandbox openclaw.json
```

### Database Connection Issues

```bash
# Test Supabase connection
cd workspace-dispatcher
npm test

# Common issues:
# - Wrong SUPABASE_URL in .env
# - Wrong SUPABASE_ANON_KEY
# - Network firewall blocking Supabase
# - Supabase project paused (free tier)
```

###High Memory Usage

```bash
# Identify memory hog
ps aux --sort=-%mem | head -10

# Close idle browser instances
pkill -f chrome

# Reduce concurrent agents in openclaw.json
"maxConcurrent": 2  // Instead of 4
```

---

## Scaling to Production

### Vertical Scaling

**Increase resources**:
- 8GB RAM for multiple concurrent browser sessions
- 4-8 CPU cores for parallel task execution
- SSD storage for faster disk I/O

### Horizontal Scaling

**Multiple executor instances**:

1. Deploy executor agent on separate machine
2. Configure to connect to same Supabase
3. Supervisor will distribute work

**Load balancing**:
- Multiple supervisor instances (future)
- Task sharding by priority/type
- Geographic distribution

---

## Updating OpenClaw

```bash
# 1. Backup current installation
cd /opt/openclaw
tar -czf backup-$(date +%Y%m%d).tar.gz .

# 2. Stop service
sudo systemctl stop openclaw

# 3. Pull latest code
git pull origin main

# 4. Update dependencies
npm install
cd workspace-dispatcher && npm install && cd ..

# 5. Run migrations (if any)
# Check CHANGELOG.md for breaking changes

# 6. Start service
sudo systemctl start openclaw

# 7. Verify
sudo systemctl status openclaw
tail -f /var/log/syslog | grep openclaw
```

---

**Production deployment requires careful configuration, monitoring, and maintenance. Follow this guide to ensure reliable operation.**
