# EcoDrop — Open-Source Peer-to-Peer Item Donation Platform

EcoDrop is a responsive web application designed to connect local community members in Estates to facilitate direct, peer-to-peer household item donations. By offering a platform to list and claim usable second-hand items, EcoDrop keeps reusable goods out of landfills and helps build stronger community connections.

---

## Key Features

* **Dynamic Navigation & Session Persistence**: Seamless header navigation that updates dynamically based on the user's authentication state using `localStorage`.
* **Neighborhood Item Showcase**: Interactive product grid displaying recent neighborhood listings with category tags, location details, and direct contact options.
* **Listing Management**: Full functionality to list new items with dynamic image uploads, description fields, category selection, and contact details.
* **Search & Filter**: Search items by keyword or location and filter by category (e.g., Electronics, Furniture, Household Items).
* **Claim & Recycle Tracking**: Mark listings as claimed to archive them directly into a community history record.
* **Responsive Editorial UI**: Custom minimalist layout built with CSS Flexbox and CSS Grid, styled with Google Fonts (*Public Sans* and *Redaction* serif).

---

## Built With

* **HTML**: Semantic markup structuring all core views (`index.html`, `browse.html`, `post.html`, `history.html`, `about.html`, `auth.html`).
* **CSS**: Pure custom stylesheet featuring flexbox header architectures, responsive grids, and clean typography layouts without heavy external framework bloat.
* **JavaScript**: Client-side logic managing UI state, DOM manipulation, authentication flows, and `localStorage` persistence.
* **Font Awesome**: Lightweight icons for visual navigation and social footer links.

---

## Project Structure

```text
EcoDrop/
├── index.html          # Landing page with hero section & featured drops
├── browse.html         # Full directory listing with search & filter controls
├── post.html           # Item creation and editing form page
├── history.html        # Archived record of claimed and recycled items
├── about.html          # Community story and testimonials
├── auth.html           # Sign up and login modal forms
├── style.css           # Global stylesheet and responsive layouts
├── script.js           # Core application logic and localStorage handling
└── images/             # Static visual assets and hero banners

```

---

## Live Demo

**Live Website:** [View Live App]()


## Getting Started

### Prerequisites

All you need is a modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).

### Running Locally

1. **Clone the repository:**
```bash
git clone https://github.com/MichaelMulwaM/EcoDrop.git
```


2. **Navigate to the project directory:**
```bash
cd ecodrop

```


3. **Launch the site:**
* Open `index.html` directly in your web browser.



---

## 📝 Usage Guide

1. **Explore Listings**: Click **PRODUCTS** in the header to view all current items available in your neighborhood.
2. **Create an Account**: Click **+ Post Item** in the navigation header to register or log in.
3. **List an Item**: Fill in the title, category, contact details, location, and upload an image to post a household item for pickup.
4. **Claim an Item**: Browse listings and click **Mark as Claimed** to transition the item into the community **HISTORY** tab.