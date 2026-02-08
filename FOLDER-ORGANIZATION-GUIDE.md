# 📁 Preet Cards Business - Folder Organization Guide

## Quick Reference: "Where Do I Put...?"

| File Type | Folder Location |
|-----------|-----------------|
| New Instagram Reel | `02-Marketing/Instagram/Reels/Posted/` |
| Product photo | `03-Content/Product-Photos/[Category]/` |
| Customer testimonial | `04-Operations/Customer-Data/Testimonials/` |
| Website screenshot | `05-Documentation/Website/` |
| Design template | `06-Assets/Templates/` |
| Airtable backup | `04-Operations/Automation/Airtable/CSV-Backups/` |
| Price list | `05-Documentation/Business/` |
| Logo files | `03-Content/Graphics/Logos/` |
| Reel music | `06-Assets/Music/` |
| Website code | `01-Website/` (Git repo - don't modify structure) |

---

## 📂 Folder Structure Overview

```
Preet Cards Business/
├── 01-Website/           → Symlink to GitHub repo
├── 02-Marketing/         → Social media & campaigns
│   ├── Instagram/
│   │   ├── Reels/
│   │   ├── Stories/
│   │   ├── Posts/
│   │   └── Graphics/
│   ├── Facebook/
│   ├── WhatsApp-Status/
│   └── Ad-Campaigns/
├── 03-Content/           → Photos, videos, graphics
│   ├── Product-Photos/
│   ├── Videos/
│   ├── Graphics/
│   └── Copy/
├── 04-Operations/        → Business automation & CRM
│   ├── Automation/
│   ├── Lead-Management/
│   └── Customer-Data/
├── 05-Documentation/     → Guides & business docs
│   ├── Website/
│   ├── Business/
│   ├── Training/
│   └── Legal/
└── 06-Assets/            → Design files & templates
    ├── Design-Files/
    ├── Fonts/
    └── Templates/
```

---

## 📝 File Naming Conventions

### Product Photos
```
category-number-variant.jpg
Examples:
  lagna-001-front.jpg
  aamantran-015-inside.jpg
  mundan-008-full.jpg
```

### Instagram Reels
```
YYYYMMDD-reel-topic-version.mp4
Examples:
  20260209-reel-wedding-showcase-v1.mp4
  20260215-reel-testimonial-sharma-v2.mp4
```

### Documents
```
YYYY-MM-DD-document-name.pdf
Examples:
  2026-02-09-price-list-february.pdf
  2026-02-15-brand-guidelines-v2.pdf
```

---

## ⏰ Weekly Maintenance (15 min every Monday)

- [ ] Export Airtable to CSV → `04-Operations/Automation/Airtable/CSV-Backups/`
- [ ] Move posted Instagram content to archive folders
- [ ] Clean up Desktop and Downloads
- [ ] Verify Google Drive sync is working
- [ ] Delete duplicate files

## 📅 Monthly Maintenance (30 min)

- [ ] Full backup to external drive
- [ ] Review and organize content library
- [ ] Archive old projects
- [ ] Update documentation as needed

---

## ☁️ Cloud Sync (Google Drive)

Sync these folders to Google Drive:
- ✅ `02-Marketing/` - Backup social content
- ✅ `03-Content/` - Backup all photos/videos  
- ✅ `04-Operations/` - Backup CRM exports
- ✅ `05-Documentation/` - Share with team

**Don't sync to cloud:**
- ❌ `01-Website/` (already on GitHub)
- ❌ `06-Assets/Design-Files/` (too large, backup manually)

---

## 🔐 3-2-1 Backup Strategy

| Copies | Location | Frequency |
|--------|----------|-----------|
| **Primary** | Mac (local) | Always |
| **Cloud** | Google Drive | Real-time sync |
| **Offsite** | External Drive | Weekly |

---

## 👥 Future Team Access Guide

| Role | Full Access | Read Only | No Access |
|------|-------------|-----------|-----------|
| Social Media Manager | 02-Marketing | 03-Content | 04-Operations |
| Designer | 03-Content, 06-Assets | 02-Marketing | 04-Operations |
| Sales | 04-Operations/Leads | 05-Documentation | Others |
