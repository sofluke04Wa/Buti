
# BEAUTY SHOP - Cart & Excel Integration

## Overview
This update adds:

* Unique product **Codes** displayed on every product card.
* A fully‑functional **shopping cart** that stores data in the browser (`localStorage`).
* A **Basket** page that renders cart contents dynamically and lets the user **download an Excel file** (`cart.xlsx`) generated on the fly using **SheetJS**.
* A ready‑to‑deploy **Google Apps Script** (`script.gs`) that receives cart data and writes it to Google Sheets, then automatically exports the sheet to Excel inside Google Drive.

The original style and layout remain unchanged.

---

## Folder structure

```
/
├─ index.html
├─ lipstick.html
├─ sunscreen.html
├─ serum.html
├─ foundation.html
├─ basket.html
├─ script.js          ← front‑end cart & Excel logic
├─ script.gs          ← Google Apps Script (backend)
└─ README.md
```

## How it works

### Front‑end
1. Each ***“เพิ่มไปยังตะกร้า”*** button carries `data-code`, `data-name`, `data-price`.
2. Clicking the button calls **`addToCart()`** in `script.js`, saving items to `localStorage`.
3. `basket.html` loads the saved cart, builds the table, shows the grand total and provides:
   * **“ดาวน์โหลด Excel”** – creates and downloads `cart.xlsx` (no server required).
   * (**optional**) automatic `fetch()` POST to your Apps Script URL (set `window.GAS_URL`).

### Google Apps Script
1. Open **Google Sheets** → **Extensions ▸ Apps Script** → paste `script.gs`.
2. Replace `YOUR_SHEET_ID` with your Sheet’s ID.
3. **Deploy** ▸ **New deployment** ▸ **Web app** (anyone w/ link).
4. Copy the “web app URL” and add to any page before `script.js` load:

```html
<script>
  window.GAS_URL = 'PASTE_YOUR_WEBAPP_URL_HERE';
</script>
```

From now on every checkout will append rows to the sheet and create an Excel copy in Drive.

---

## Dependencies

* **Tailwind CSS** (already included via CDN).
* **SheetJS / xlsx** 0.18 CDN – added automatically on `basket.html`.

---

Enjoy!
