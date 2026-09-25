# Roamari website — GitHub Pages pack

Static site, no build step. Pages use the same addresses as the old Framer site, so existing links keep working:

| Address | Page |
|---|---|
| `/` | Home |
| `/the-experience/` | The Experience |
| `/our-impact/` | Our Impact |
| `/stay-with-us/` | Stay With Us + booking form (`#reserve`) |
| `/privacy/` | Privacy notice (draft) |
| `/book/`, `/london/`, `/budapest/` | Old Framer links, forwarded to Stay With Us |

## 1. Booking form — already connected

The form sends through **Web3Forms** (free, 250 requests a month). The access key is already in `site.js` (`web3formsKey`). Requests arrive at the recipient email set in your Web3Forms dashboard (bookings@roamari.co). To change where they go, change it in the Web3Forms dashboard, not in the website files.

The key is meant to sit in the page: it only lets people *send* a request to your inbox, never read it.

## 2. Put it on GitHub

1. New repository under `bok-a`, e.g. `roamari-site`, **Public**.
2. *Add file → Upload files*. Open the unzipped `roamari-option-c` folder, select **everything inside** (Ctrl+A — make sure `.nojekyll` is included) and drag it in. Commit.
3. *Settings → Pages → Deploy from a branch → main / (root) → Save*.
4. After a minute the site is live at `bok-a.github.io/roamari-site/`. Check every page and send yourself a test booking.

## 3. Switch roamari.co from Framer (only when step 2 looks right)

In **GitHub → Settings → Pages → Custom domain** type `roamari.co` and save. Then in **IONOS → roamari.co → DNS**:

| Action | Type | Host | Value |
|---|---|---|---|
| Change | A | @ | `31.43.160.6` → `185.199.108.153` |
| Change | A | @ | `31.43.161.6` → `185.199.109.153` |
| Add | A | @ | `185.199.110.153` |
| Add | A | @ | `185.199.111.153` |
| Change | CNAME | www | `sites.framer.app` → `bok-a.github.io` |

When IONOS offers "Preview for www", choose **do not add**. **Leave MX, SPF (TXT `v=spf1 include:_spf-eu.ionos.com ~all`), DKIM and DMARC exactly as they are** — they run your email.

When GitHub shows "DNS check successful", tick **Enforce HTTPS**. Keep Framer until roamari.co shows the new site on phone and laptop, then cancel it.

## Still to add
- Budapest photos (the card shows an illustration and "Photos coming soon").
- Privacy notice: marked *Draft*; confirm how long booking requests are kept.

## Changing a photo
Photos are in `img/`. Upload a new file with the same name to replace it everywhere.
