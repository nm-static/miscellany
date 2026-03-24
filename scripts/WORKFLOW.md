# Miscellany Content Publishing Workflow

## Overview

This document describes the automated content publishing workflow for the Short Courses & Miscellany website.

```
nm-obsidian/teaching (push, changes in miscellany/)
        │
        ▼
   [n8n: Miscellany Content Sync]
        │
        ├── Run parser
        ├── Push to staging branch
        ├── Create Fizzy card
        └── Send Mattermost notification
        │
        ▼
   staging--miscellany.netlify.app (preview)
        │
        ▼
   [Approval: Close Fizzy card]
        │
        ▼
   [n8n: Miscellany Deploy to Production]
        │
        ├── Merge staging → main
        └── Push (triggers production deploy)
        │
        ▼
   miscellany.neeldhara.courses (production)
```

## Setup Checklist

- [x] Create Fizzy board and note board ID + column IDs
- [x] Create n8n workflows (sync + deploy) — both active
- [x] Repo already on Hetzner server
- [ ] Create `staging` branch in nm-static/miscellany repo
- [ ] Configure Netlify branch deploys for `staging`
- [ ] Add GitHub webhook pointing to `https://n8n.neeldhara.website/webhook/miscellany-content-push`
- [ ] Configure Fizzy webhook for card closure → `https://n8n.neeldhara.website/webhook/miscellany-fizzy-card-closed`
- [ ] Make scripts executable on Hetzner: `chmod +x ~/repos/nm-static/miscellany/scripts/*.sh`

## IDs and Endpoints

### n8n Workflows

| Workflow | ID | Webhook Path | Status |
|---|---|---|---|
| Miscellany Content Sync | `IswtVKanq4rgz5N6` | `POST /webhook/miscellany-content-push` | Active |
| Miscellany Deploy to Production | `tEqIiRf57riUVZJT` | `POST /webhook/miscellany-fizzy-card-closed` | Active |

### Fizzy

| Resource | ID |
|---|---|
| Board: 🎁 Miscellany and Short Courses | `03fte6ywqcx98s8k52j39gti8` |
| Active column | `03fte9y5w2gyfhj9ub9p9vt1n` |
| Waiting column | `03fte9yvyt5he066cvika29xt` |

### Mattermost

| Resource | Value |
|---|---|
| Channel ID | `niuu3sg7u3bg9nj9uqx5q73yea` |

### Netlify

- Staging: `staging--miscellany.netlify.app` (auto-deploys from `staging` branch)
- Production: `miscellany.neeldhara.courses` (auto-deploys from `main` branch)

## GitHub Webhook

**Repository:** `nm-obsidian/teaching` (or wherever you push Obsidian changes)

Configure a webhook:
- **Payload URL:** `https://n8n.neeldhara.website/webhook/miscellany-content-push`
- **Content type:** `application/json`
- **Events:** Just the push event

This is a separate webhook from advalgo (`/webhook/advalgo-content-push`).
The sync script checks if the push includes changes in the `miscellany/` folder and exits early if not.

## Fizzy Webhook

Configure in Fizzy → Board Settings → Webhooks for the 🎁 Miscellany board:
- **URL:** `https://n8n.neeldhara.website/webhook/miscellany-fizzy-card-closed`
- **Events:** Card closed

## Netlify Branch Deploys

One-time setup:
1. Go to Netlify Dashboard → Your site → Site configuration
2. Navigate to Build & deploy → Branches and deploy contexts
3. Under "Branch deploys", select "Let me add individual branches"
4. Add `staging` to the list
5. Save changes

## Workflow Details

### Content Sync

**Trigger:** GitHub webhook on push

**Flow:** Webhook → Respond OK + SSH → Parse Output → Has Changes? → Build Card Content → Create Fizzy Card → Extract Card Number → Update Card Description → Build Mattermost Message → Notify Mattermost

The sync script (`scripts/sync-content.sh`):
1. Pulls latest from Obsidian vault
2. Checks if `miscellany/` has changes (exits early if not)
3. Checks out staging branch, merges main
4. Runs the parser (`node parse.mjs`)
5. Commits and pushes to staging
6. Outputs JSON with status, changed pages, preview URL

### Deploy to Production

**Trigger:** Fizzy card closed on the Miscellany board

**Flow:** Webhook → Respond OK + Extract Card Info → Is Miscellany Board? → SSH Deploy → Parse Output → Build Message → Notify Mattermost

The deploy script (`scripts/deploy-to-production.sh`):
1. Fetches latest
2. Checks out main, merges staging
3. Pushes to main (triggers Netlify production deploy)

## Hetzner Server

Repo is already cloned. After pushing the scripts:
```bash
cd ~/repos/nm-static/miscellany
git pull origin main
chmod +x scripts/*.sh

# Create staging branch if not exists
git checkout -b staging
git push -u origin staging
git checkout main
```

## Testing

### Manual test - Content sync:
```bash
cd ~/repos/nm-static/miscellany
./scripts/sync-content.sh
```

### Manual test - Deploy:
```bash
cd ~/repos/nm-static/miscellany
./scripts/deploy-to-production.sh
```

### Test Fizzy card creation:
```bash
curl -X POST \
  -H "Authorization: Bearer 4jGzJQHepfupkbGAR1U1W7u9" \
  -H "Content-Type: application/json" \
  -d '{"title":"🧪 Test Card","status":"published","column_id":"03fte9yvyt5he066cvika29xt"}' \
  "https://fizzy.neeldhara.cloud/2/boards/03fte6ywqcx98s8k52j39gti8/cards.json"
```
