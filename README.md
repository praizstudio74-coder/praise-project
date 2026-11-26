# 🍲 Praise Restaurant – High-Performance Web App (SPA & PWA)

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel%20Live-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20App-4D970C?style=for-the-badge&logo=pwa)](manifest.json)
[![SPA Architecture](https://img.shields.io/badge/Architecture-Single%20Page%20App-F47727?style=for-the-badge)](index.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

A world-class, responsive, and professional Progressive Web App (PWA) & Single Page App (SPA) for **Praise Restaurant**, serving authentic West African cuisine in Lekki Phase 1, Lagos, Nigeria.

---

## 📱 Key Web App Features

### 1. 📲 Mobile App Download & Installation System
- **Android & Desktop PWA:** Native 1-click install banner and modal utilizing the browser's `beforeinstallprompt` event.
- **iPhone & iPad (iOS Safari):** Built-in interactive 3-step walkthrough guiding customers to tap "Share" and "Add to Home Screen".
- **Real-Time QR Code Scanner:** Diners can scan the QR code with their mobile cameras to launch the Web App instantly on any smartphone.
- **Offline Shell & Service Worker (`sw.js`):** Fully caches essential assets for lightning-fast offline startup.

### 2. 👤 Customer Authentication & VIP Diners Loyalty Suite
- **Sign In & Sign Up Modals:** Fast modal overlay allowing customers to create an account with their Full Name, Phone, Email, Delivery Address, and Password.
- **500 Welcome Loyalty Points:** New customers receive 500 VIP points (₦2,500 food value) credited instantly upon registration.
- **Automated Profile Pre-fill:** Automatically populates the customer's name, phone, and delivery address into the Food Checkout, Table Reservation, and Catering forms.
- **VIP Customer Header Pill:** Dynamic header display showing `👤 [Name] • 500 Pts` with interactive account details and sign out.
- **Instant Demo VIP Account:** 1-click test button for instant evaluation without typing.

### 3. 🍲 Interactive Food Customizer & Ordering Engine
- **Dish Customizer Modal:** Select traditional swallows (Pounded Yam, Semovita, Eba, Fufu, Wheat), choose spice levels (Mild, Medium, Hot, Extra Fiery Asun), and add extra portions (Fried Dodo, Peppered Chicken, Zobo Drink).
- **Persistent Cart & Promo Codes:** Saves cart items to `localStorage`, calculates 7.5% Nigerian VAT, and applies promotional codes like `PRAISE10`.
- **Live Order Tracker:** Visual 4-step kitchen progress stepper (Order Placed, Simmering in Kitchen, Out for Hot Delivery, Delivered).

### 4. 🪑 Interactive Seating Studio & Table Booking
- Visual floor plan selector: Main Heritage Dining Hall, Romantic VIP Terrace, or Chef's Private Table.
- Instant booking reference code generation and SMS/WhatsApp confirmation simulation.

---

## 🎨 Brand Identity & Palette

- **Primary Green:** `#4D970C` (Fresh herbs, sustainability, health)
- **Dark Charcoal:** `#171516` (Luxury dining ambiance, contrast, sophistication)
- **Food Orange:** `#F47727` (Spice, flame, high-conversion action buttons)
- **Warm Cream:** `#F5F0E8` (Welcoming hospitality, comfortable canvas)
- **Pure White:** `#FFFFFF` (Crisp readability, clean card surfaces)


**Typography:**
- **Headings & Accents:** `Playfair Display` (Luxury serif display)
- **Body & Controls:** `Plus Jakarta Sans` (Clean modern geometric sans-serif)

---

## 🌐 Website Pages

1. **🏠 Home (`index.html`):**
   - **Slider Revolution Hero Experience:** 3 cinematic art-directed slides with Ken Burns image scaling, staggered text animations, time-progress bar, floating badges, touch/swipe and keyboard arrow support.
   - **Welcome & Heritage Section:** Story, 15+ years stats, 4 pillars of culinary integrity.
   - **Interactive Menu Explorer:** Category filter tabs (Rice Dishes, Swallows & Soups, Peppered Meats, Pepper Soups, Pasta & Sides, Beverages).
   - **Original Menu Card Viewer:** Interactive modal displaying the authentic high-resolution restaurant poster.
   - **Special Offers & Combos:** Limited-time family deals with instant "Claim Combo" cart addition.
   - **Catering Feature Banner:** Highlights wedding and gala catering.
   - **Testimonials:** Verified diner reviews with 4.9/5 star ratings.
   - **Quick Table Reservation Banner.**

2. **📖 About Us (`about.html`):**
   - Generational founding story rooted in grandmother's wood-fired cooking.
   - Mission and Vision statements.
   - Commitment to farm-fresh local sourcing and stone-ground traditional spices.
   - Executive culinary team profiles (Master Chef Praise Adewale, Chef Amina Bello, Chef Emeka Okafor).
   - High-resolution culinary gallery.

3. **🍽️ Our Services (`services.html`):**
   - Detailed features for Dine-In Experience, Express Hot Delivery, and Curbside Takeaway.
   - **Professional Catering Spotlight:**
     - Silver Heritage Banquet (₦8,500 / guest)
     - Gold Celebration Feast (₦14,500 / guest)
     - Imperial Royal Gala (₦22,000 / guest)
   - **Interactive Catering Budget Calculator:** Dynamic guests slider (20 to 500+ guests) with instant cost recalculation.
   - Frequently Asked Questions (FAQ) accordion.

4. **📍 Contact Us (`contact.html`):**
   - Direct contact cards (Phone, WhatsApp, Email, Operating Hours, Location).
   - Interactive OpenStreetMap frame pinned to 14 Admiralty Way, Lekki Phase 1, Lagos.
   - Client-side validated contact inquiry form with interactive submit confirmation modal.

---

## ⚡ Global Interactive Features

- **Persistent Shopping Cart (`localStorage`):** Add dishes across any page, adjust quantities, see subtotal, 7.5% Nigerian VAT, free delivery threshold, and simulated checkout receipt.
- **Table Reservation Modal:** Book a table from the navigation bar on any page with date, time, party size, and seating area.
- **Mobile Responsive Navigation:** Smooth slide-over navigation drawer for tablets and smartphones.
- **Toast Notifications:** Instant visual feedback when dishes are added or forms submitted.

---

## 📁 Repository File Structure

```
praise-restaurant/
├── index.html              # Home Page (Slider Revolution Hero, Menu, Testimonials)
├── about.html              # About Us Page (Story, Mission, Chefs, Sourcing)
├── services.html           # Services Page (Dine-in, Takeaway, Delivery, Catering Calculator)
├── contact.html            # Contact Us Page (Map, Contact Info, Validated Form)
├── README.md               # Project documentation & GitHub Pages guide
├── .gitignore              # Git ignore file
├── css/
│   └── style.css           # Master stylesheet (variables, animations, responsive rules)
├── js/
│   ├── main.js             # Global controller (cart, modals, calculator, validation)
│   ├── menu-data.js        # Comprehensive menu and catering packages dataset
│   └── slider.js           # Slider Revolution hero animation engine
└── images/
    └── menu-poster.jpg     # Official high-resolution restaurant menu card poster
```

---

## 🚀 How to Run Locally

No compilation, Node.js, or complex runtime required!
1. Clone or download this repository.
2. Double-click `index.html` to open it in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

To make your website live on the internet using GitHub Pages:

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Praise Restaurant website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/praise-restaurant.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** > **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4. Choose Branch: `main` and Folder: `/ (root)`, then click **Save**.
5. Within 1 minute, your website will be live at:
   `https://<your-username>.github.io/praise-restaurant/`

---

## 📄 License

This project is licensed under the MIT License - feel free to customize and expand for commercial or personal restaurant use.
