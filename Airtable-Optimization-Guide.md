# 🔧 Optimize Your Existing Airtable Base
**You have 4 tables - let's make them perfect! (30 min)**

---

## Your Current Tables

| Table | Purpose |
|-------|---------|
| **Preet Cards** | Main leads/customers |
| **Card Catalog** | Product inventory |
| **Follow-ups** | Task management |
| **Card Designs** | Design library |

✅ Great foundation! Just needs optimization.

---

## PART 1: Check Main Table Fields

**Open "Preet Cards" table and verify these exist:**

| Must Have | Type | Status |
|-----------|------|--------|
| Name | Text | ☐ |
| Phone | Phone | ☐ |
| WhatsApp | Phone | ☐ |
| Status | Single select | ☐ |
| Priority | Single select | ☐ |
| Event Type | Single select | ☐ |
| Event Date | Date | ☐ |
| Budget | Single select | ☐ |
| Next Follow-up | Date + Time | ☐ |
| Notes | Long text | ☐ |
| Lead Source | Single select | ☐ |
| Value | Currency | ☐ |

### Add Missing Fields

**Status options:** New, Contacted, Quoted, Follow-up, Won, Lost

**Priority options:** 🔥 Hot, 🌟 Warm, ❄️ Cold

**Lead Source options:** Website, WhatsApp, Instagram, Facebook, Referral, Walk-in

**Budget options:** Under ₹5k, ₹5k-10k, ₹10k-20k, ₹20k-50k, Above ₹50k

---

## PART 2: Create Essential Views

| View | Filter | Sort |
|------|--------|------|
| **🔥 Hot Leads** | Priority = Hot | Event Date ↑ |
| **📞 Follow-ups** | Next Follow-up = next 7 days | Next Follow-up ↑ |
| **🆕 New** | Status = New | Created time ↓ |
| **💰 Won** | Status = Won | Event Date ↓ |

**To create:** View dropdown → Create → Grid → Name → Filter → Sort

---

## PART 3: Link Tables

| In This Table | Add Field | Link To |
|---------------|-----------|---------|
| Preet Cards | "Card Designs" | Card Designs table |
| Preet Cards | "Follow-ups" | Follow-ups table |
| Follow-ups | "Lead" | Preet Cards table |
| Card Designs | "Used In" | Preet Cards table |

---

## PART 4: Column Order

Drag columns to this order:
1. Name
2. Phone
3. Status
4. Priority
5. Event Date
6. Next Follow-up
7. Budget
8. Notes

---

## ✅ Tonight's Checklist

- [ ] Check main table for missing fields
- [ ] Add any missing fields
- [ ] Create 4 views
- [ ] Link tables together
- [ ] Reorder columns
- [ ] Add 2 test leads
- [ ] Install mobile app

---

## Daily Workflow

| When | Action |
|------|--------|
| **Morning** | Check 📞 Follow-ups → 🆕 New |
| **After calls** | Update Status → Notes → Next Follow-up |
| **Evening** | Review 🔥 Hot Leads |

---

**Open Airtable now:** https://airtable.com
