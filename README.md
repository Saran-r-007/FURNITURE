# FurniSwift – Final Version

Modern furniture ordering website with dark theme, 50 products, and product-like 3D previews.

## Features

- **Home:** Hero with big background image, Artisan Spaces, ENTER SHOWROOM, DESIGN STUDIO
- **Market:** 50 products, 10 per page, sort (Name/Price/Newest), filter by category
- **Categories:** Sofas, Chairs, Tables, Beds, Cabinets, **Lighting** (bulbs, lamps, etc.)
- **3D View:** Product-shaped 3D preview (sofa, chair, table, bed, cabinet, bulb) – not just a box. Rotate, zoom. Scrollable overlay.
- **User:** ESTABLISH IDENTITY (Login/Register), profile photo, personal details, Profile page
- **Cart:** Add/remove, quantity, checkout. **Orders:** Order history with status
- **Design AI:** 3D Preview & AI Recommendations
- **Footer:** FurniSwift, Designer Hub address, Social Reach

## Tech

- **HTML, CSS, JavaScript only** – no backend. Data in `localStorage`.
- **Three.js** (CDN) for 3D previews.

## How to run

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Use **ESTABLISH IDENTITY** to register (email, password, profile photo, address) or login.
3. Go to **MARKET** – browse 50 products, filter (ALL, SOFAS, CHAIRS, TABLES, BEDS, CABINETS, LIGHTING), sort, use pagination (10 per page).
4. Click a product → detail modal. **Add to Cart** or **3D View** to see the product-shaped 3D model.
5. **Cart** → Proceed to Checkout. **ORDERS** shows history. **PROFILE** to edit details and photo.

## Files

- `index.html` – Single-page app (Home, Market, Design AI, Orders, Cart, Profile, modals, 3D overlay, footer)
- `styles.css` – Dark theme, gradients, layout, responsive
- `script.js` – Data, auth, products (50), cart, orders, 3D shapes, pagination, sort, filter

## 3D shapes

- **Sofa:** Seat + back + two arms  
- **Chair:** Seat + back + four legs  
- **Table:** Top + four legs  
- **Bed:** Mattress + headboard  
- **Cabinet:** Body + two doors  
- **Lighting:** Bulb (sphere) + stand (cylinder) + base  

---

**FurniSwift** – Coimbatore Crafted · Future-Proof Comfort · India's Interior Revolution
