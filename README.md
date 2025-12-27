# 🎨 Pixnix - Beautiful Wallpaper Website

A modern, responsive wallpaper website built with **HTML, CSS, and vanilla JavaScript**, powered by the **Unsplash API**.

## ✨ Features

### 🎯 Core Features
- **Dynamic Image Loading** - Fetch high-quality wallpapers from Unsplash API
- **8 Categories** - Nature, Anime, Gaming, Cars, Abstract, Space, 3D Art, Dark/AMOLED
- **Advanced Search** - Search wallpapers by keyword with debounced input
- **Smart Filters** - Filter by resolution (Full HD, 2K, 4K) and device type (Desktop, Tablet, Mobile)
- **Infinite Scroll** - Seamless browsing experience with automatic pagination
- **Load More Button** - Manual loading option for better control

### 🎨 Design & UX
- **Modern UI** - Clean, attractive interface with vibrant gradients
- **Glassmorphism** - Beautiful frosted glass effects throughout
- **Dark Mode** - Toggle between light and dark themes with smooth transitions
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Smooth Animations** - Micro-interactions and smooth transitions everywhere
- **Premium Aesthetics** - Eye-friendly colors and modern typography (Inter, Outfit)

### 🖼️ Image Interactions
- **Modal Preview** - Click any image to view in full-screen modal
- **Download Support** - One-click download with proper attribution
- **Lazy Loading** - Optimized performance with progressive image loading
- **Hover Effects** - Scale and overlay animations on image hover
- **Image Information** - Resolution, likes, and author details

### ⚡ Performance
- **Lazy Loading** - Images load only when needed
- **Debounced Search** - Optimized API calls
- **Infinite Scroll** - Smooth pagination without page reloads
- **Lightweight** - No frameworks, pure vanilla JavaScript

### 🔧 Technical Features
- **SEO Optimized** - Proper meta tags, semantic HTML, and heading structure
- **Accessible** - ARIA labels and keyboard navigation support
- **Clean Code** - Well-commented and maintainable
- **API Integration** - Proper Unsplash API usage with download tracking

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access

### Installation

1. **Clone or download** this repository

2. **Open the project**
   ```
   Simply open index.html in your web browser
   ```

3. **Or use a local server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
Pixnix/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with CSS variables
├── app.js             # JavaScript logic and API integration
└── README.md          # Documentation
```

## 🎯 Usage

### Browse Categories
- Click on any category card to view wallpapers in that category
- Categories include: Nature, Anime, Gaming, Cars, Abstract, Space, 3D Art, Dark/AMOLED

### Search Wallpapers
- Use the search bar in the navigation to find specific wallpapers
- Search is debounced for better performance

### Filter Results
- **Resolution**: All, Full HD (1920×1080), 2K (2560×1440), 4K (3840×2160)
- **Device**: All, Desktop, Tablet, Mobile

### View & Download
1. Click any wallpaper to open the preview modal
2. View full resolution image with details
3. Click "Download" to save the wallpaper
4. Click "View on Unsplash" to see the original

### Toggle Dark Mode
- Click the sun/moon icon in the navigation bar
- Preference is saved in localStorage

## 🔑 API Configuration

The app uses the Unsplash API. The access key is already included:

```javascript
UNSPLASH_ACCESS_KEY: 'CtDAjUbW0MEtjO0Qn3UKjO2_JhGvz-vLEqjJE6-6mbs'
```

**Note**: For production use, consider implementing a backend proxy to secure your API key.

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-hue: 260;        /* Primary color hue */
    --primary-sat: 85%;        /* Saturation */
    --primary-light: 60%;      /* Lightness */
    /* Other variables... */
}
```

### Categories
Add or modify categories in `index.html`:

```html
<button class="category-card" data-category="your-category">
    <div class="category-icon">🎯</div>
    <span class="category-name">Your Category</span>
</button>
```

### Images Per Page
Modify in `app.js`:

```javascript
const CONFIG = {
    IMAGES_PER_PAGE: 30  // Change this number
};
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 📄 License

This project is open source. Images are provided by [Unsplash](https://unsplash.com) and are subject to the [Unsplash License](https://unsplash.com/license).

## 🙏 Credits

- **Images**: [Unsplash](https://unsplash.com)
- **Fonts**: [Google Fonts](https://fonts.google.com) (Inter, Outfit)
- **Icons**: Custom SVG icons

## 🐛 Known Issues

None currently. Please report any issues you find!

## 🚀 Future Enhancements

- [ ] User favorites/collections
- [ ] Image color palette extraction
- [ ] Share functionality
- [ ] Progressive Web App (PWA)
- [ ] Service Worker for offline support
- [ ] Advanced filters (colors, orientation)
- [ ] Grid layout options (masonry, column count)

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Made with ❤️ using HTML, CSS, and vanilla JavaScript**
