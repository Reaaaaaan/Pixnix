// ================================
// Configuration & Constants
// ================================

const CONFIG = {
    UNSPLASH_ACCESS_KEY: 'CtDAjUbW0MEtjO0Qn3UKjO2_JhGvz-vLEqjJE6-6mbs',
    UNSPLASH_API_BASE: 'https://api.unsplash.com',
    IMAGES_PER_PAGE: 30,
    DEFAULT_CATEGORY: 'nature'
};

// ================================
// State Management
// ================================

const state = {
    currentCategory: CONFIG.DEFAULT_CATEGORY,
    currentPage: 1,
    searchQuery: '',
    filters: {
        resolution: 'all',
        device: 'all'
    },
    isLoading: false,
    hasMore: true,
    images: [],
    theme: localStorage.getItem('theme') || 'light'
};

// ================================
// DOM Elements
// ================================

const elements = {
    searchInput: document.getElementById('searchInput'),
    themeToggle: document.getElementById('themeToggle'),
    categoryCards: document.querySelectorAll('.category-card'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    galleryGrid: document.getElementById('galleryGrid'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    loadMoreContainer: document.getElementById('loadMoreContainer'),
    resultsCount: document.getElementById('resultsCount'),
    currentCategoryTitle: document.querySelector('.current-category-title'),

    // Modal elements
    imageModal: document.getElementById('imageModal'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalClose: document.getElementById('modalClose'),
    modalImage: document.getElementById('modalImage'),
    modalTitle: document.getElementById('modalTitle'),
    modalAuthorLink: document.getElementById('modalAuthorLink'),
    modalResolution: document.getElementById('modalResolution'),
    modalLikes: document.getElementById('modalLikes'),
    downloadBtn: document.getElementById('downloadBtn'),
    viewOnUnsplashBtn: document.getElementById('viewOnUnsplashBtn'),

    navbar: document.getElementById('navbar')
};

// ================================
// API Functions
// ================================

/**
 * Fetch images from Unsplash API
 * @param {string} query - Search query or category
 * @param {number} page - Page number
 * @returns {Promise<Array>} Array of image objects
 */
async function fetchImages(query, page = 1) {
    try {
        const url = query
            ? `${CONFIG.UNSPLASH_API_BASE}/search/photos`
            : `${CONFIG.UNSPLASH_API_BASE}/photos`;

        const params = new URLSearchParams({
            client_id: CONFIG.UNSPLASH_ACCESS_KEY,
            page: page,
            per_page: CONFIG.IMAGES_PER_PAGE,
            ...(query && { query: query }),
            ...(query && { orientation: getOrientation() })
        });

        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle both search results and regular photo listing
        return query ? data.results : data;
    } catch (error) {
        console.error('Error fetching images:', error);
        showError('Failed to load images. Please try again.');
        return [];
    }
}

/**
 * Get image orientation based on device filter
 * @returns {string} Orientation parameter
 */
function getOrientation() {
    const device = state.filters.device;
    if (device === 'mobile') return 'portrait';
    if (device === 'desktop') return 'landscape';
    return 'landscape'; // Default
}

/**
 * Filter images based on resolution
 * @param {Array} images - Array of image objects
 * @returns {Array} Filtered images
 */
function filterByResolution(images) {
    const resolution = state.filters.resolution;

    if (resolution === 'all') return images;

    const [width, height] = resolution.split('x').map(Number);

    return images.filter(img => {
        return img.width >= width && img.height >= height;
    });
}

// ================================
// UI Rendering Functions
// ================================

/**
 * Render images to the gallery
 * @param {Array} images - Array of image objects
 * @param {boolean} append - Whether to append or replace
 */
function renderImages(images, append = false) {
    if (!append) {
        elements.galleryGrid.innerHTML = '';
        state.images = [];
    }

    const filteredImages = filterByResolution(images);
    state.images.push(...filteredImages);

    filteredImages.forEach((image, index) => {
        const item = createGalleryItem(image, index);
        elements.galleryGrid.appendChild(item);
    });

    // Update results count
    updateResultsCount();

    // Initialize lazy loading for new images
    initLazyLoading();
}

/**
 * Create a gallery item element
 * @param {Object} image - Image object from Unsplash
 * @param {number} index - Index for animation delay
 * @returns {HTMLElement} Gallery item element
 */
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.imageId = image.id;

    const img = document.createElement('img');
    img.dataset.src = image.urls.regular;
    img.alt = image.alt_description || image.description || 'Wallpaper';
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';

    const title = document.createElement('div');
    title.className = 'gallery-item-title';
    title.textContent = image.description || image.alt_description || 'Beautiful Wallpaper';

    const author = document.createElement('div');
    author.className = 'gallery-item-author';
    author.textContent = `by ${image.user.name}`;

    overlay.appendChild(title);
    overlay.appendChild(author);

    item.appendChild(img);
    item.appendChild(overlay);

    // Add click event to open modal
    item.addEventListener('click', () => openModal(image));

    return item;
}

/**
 * Update the results count display
 */
function updateResultsCount() {
    const count = state.images.length;
    elements.resultsCount.textContent = `${count} wallpaper${count !== 1 ? 's' : ''}`;
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    elements.galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 64px; height: 64px; margin: 0 auto 1rem; opacity: 0.5;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">${message}</p>
        </div>
    `;
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show the spinner
 */
function toggleLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.loadingSpinner.classList.add('hidden');
    }
}

/**
 * Show/hide load more button
 * @param {boolean} show - Whether to show the button
 */
function toggleLoadMore(show) {
    if (show && state.hasMore) {
        elements.loadMoreContainer.classList.remove('hidden');
    } else {
        elements.loadMoreContainer.classList.add('hidden');
    }
}

// ================================
// Category & Filter Functions
// ================================

/**
 * Change active category
 * @param {string} category - Category name
 */
async function changeCategory(category) {
    state.currentCategory = category;
    state.currentPage = 1;
    state.hasMore = true;
    state.searchQuery = '';
    elements.searchInput.value = '';

    // Update UI
    updateCategoryUI(category);
    updateCategoryTitle(category);

    // Load images
    await loadImages(false);
}

/**
 * Update category UI
 * @param {string} category - Active category
 */
function updateCategoryUI(category) {
    elements.categoryCards.forEach(card => {
        if (card.dataset.category === category) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

/**
 * Update category title
 * @param {string} category - Category name
 */
function updateCategoryTitle(category) {
    const formatted = category.charAt(0).toUpperCase() + category.slice(1);
    elements.currentCategoryTitle.textContent = state.searchQuery
        ? `Search: "${state.searchQuery}"`
        : `${formatted} Wallpapers`;
}

/**
 * Handle filter change
 * @param {string} filterType - Type of filter (resolution/device)
 * @param {string} value - Filter value
 */
function changeFilter(filterType, value) {
    state.filters[filterType] = value;

    // Update filter UI
    elements.filterBtns.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            if (btn.dataset.value === value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    // Re-render with current images filtered
    renderImages(state.images, false);

    // If we need more images due to filtering, load more
    if (state.images.length < CONFIG.IMAGES_PER_PAGE && state.hasMore) {
        loadImages(true);
    }
}

// ================================
// Search Functions
// ================================

let searchTimeout;

/**
 * Handle search input
 * @param {string} query - Search query
 */
function handleSearch(query) {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        state.searchQuery = query.trim();
        state.currentPage = 1;
        state.hasMore = true;

        // Clear category selection
        elements.categoryCards.forEach(card => card.classList.remove('active'));

        updateCategoryTitle(state.currentCategory);
        await loadImages(false);
    }, 500); // Debounce 500ms
}

// ================================
// Image Loading Functions
// ================================

/**
 * Load images based on current state
 * @param {boolean} append - Whether to append to existing images
 */
async function loadImages(append = false) {
    if (state.isLoading) return;

    state.isLoading = true;
    toggleLoading(true);
    toggleLoadMore(false);

    try {
        const query = state.searchQuery || state.currentCategory;
        const images = await fetchImages(query, state.currentPage);

        if (images.length === 0) {
            state.hasMore = false;
            if (!append) {
                showError('No wallpapers found. Try a different search or category.');
            }
        } else {
            renderImages(images, append);
            state.hasMore = images.length === CONFIG.IMAGES_PER_PAGE;
        }
    } catch (error) {
        console.error('Error loading images:', error);
        showError('Something went wrong. Please try again.');
    } finally {
        state.isLoading = false;
        toggleLoading(false);
        toggleLoadMore(true);
    }
}

/**
 * Load more images (pagination)
 */
async function loadMore() {
    state.currentPage++;
    await loadImages(true);
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    const images = elements.galleryGrid.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// ================================
// Modal Functions
// ================================

/**
 * Download image automatically
 * @param {string} imageUrl - Image URL to download
 * @param {string} filename - Filename for the downloaded image
 */
async function downloadImage(imageUrl, filename) {
    try {
        // Show download started feedback
        const originalText = elements.downloadBtn.querySelector('span').textContent;
        elements.downloadBtn.querySelector('span').textContent = 'جاري التحميل...';
        elements.downloadBtn.disabled = true;

        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            // Reset button text
            elements.downloadBtn.querySelector('span').textContent = 'تم التحميل ✓';
            elements.downloadBtn.disabled = false;

            // Reset back to original after 2 seconds
            setTimeout(() => {
                elements.downloadBtn.querySelector('span').textContent = originalText;
            }, 2000);
        }, 100);

    } catch (error) {
        console.error('Error downloading image:', error);
        elements.downloadBtn.querySelector('span').textContent = 'خطأ في التحميل';
        elements.downloadBtn.disabled = false;

        // Try fallback method
        setTimeout(() => {
            window.open(imageUrl, '_blank');
            elements.downloadBtn.querySelector('span').textContent = 'Download';
        }, 1500);
    }
}

/**
 * Open image modal
 * @param {Object} image - Image object
 */
function openModal(image) {
    elements.modalImage.src = image.urls.regular;
    elements.modalImage.alt = image.alt_description || image.description || 'Wallpaper';
    elements.modalTitle.textContent = image.description || image.alt_description || 'Beautiful Wallpaper';
    elements.modalAuthorLink.textContent = image.user.name;
    elements.modalAuthorLink.href = image.user.links.html + '?utm_source=pixnix&utm_medium=referral';
    elements.modalResolution.textContent = `${image.width} × ${image.height}`;
    elements.modalLikes.textContent = image.likes || 0;

    // Store image data for download (use highest quality available)
    const downloadUrl = image.urls.full || image.urls.raw || image.urls.regular;
    const filename = `pixnix-${image.id}-${image.width}x${image.height}.jpg`;

    // Remove previous download event listener by cloning the button
    const newDownloadBtn = elements.downloadBtn.cloneNode(true);
    elements.downloadBtn.parentNode.replaceChild(newDownloadBtn, elements.downloadBtn);
    elements.downloadBtn = newDownloadBtn;

    // Add new download event listener with automatic download
    elements.downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await downloadImage(downloadUrl, filename);
    });

    // Set Unsplash link
    elements.viewOnUnsplashBtn.href = image.links.html + '?utm_source=pixnix&utm_medium=referral';

    // Show modal
    elements.imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track download for Unsplash API guidelines
    trackDownload(image.links.download_location);
}

/**
 * Close image modal
 */
function closeModal() {
    elements.imageModal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Track download (required by Unsplash API)
 * @param {string} downloadLocation - Download tracking URL
 */
async function trackDownload(downloadLocation) {
    try {
        await fetch(downloadLocation, {
            headers: {
                'Authorization': `Client-ID ${CONFIG.UNSPLASH_ACCESS_KEY}`
            }
        });
    } catch (error) {
        console.error('Error tracking download:', error);
    }
}

// ================================
// Theme Functions
// ================================

/**
 * Initialize theme
 */
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

/**
 * Toggle theme
 */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
}

// ================================
// Scroll Functions
// ================================

/**o
 * Handle scroll for navbar shadow
 */
function handleScroll() {
    if (window.scrollY > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

/**
 * Initialize infinite scroll
 */
function initInfiniteScroll() {
    let isNearBottom = false;

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        // Check if user is near bottom (within 500px)
        if (scrollHeight - scrollTop - clientHeight < 500) {
            if (!isNearBottom && state.hasMore && !state.isLoading) {
                isNearBottom = true;
                loadMore();
            }
        } else {
            isNearBottom = false;
        }
    });
}

// ================================
// Event Listeners
// ================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Search
    elements.searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Category cards
    elements.categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            changeCategory(card.dataset.category);
        });
    });

    // Filter buttons
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.dataset.filter, btn.dataset.value);
        });
    });

    // Load more button
    elements.loadMoreBtn.addEventListener('click', loadMore);

    // Modal close
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.imageModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Scroll for navbar
    window.addEventListener('scroll', handleScroll);
}

// ================================
// Initialization
// ================================

/**
 * Initialize the application
 */
async function init() {
    console.log('🎨 Initializing Pixnix...');

    // Initialize theme
    initTheme();

    // Initialize event listeners
    initEventListeners();

    // Initialize infinite scroll
    initInfiniteScroll();

    // Load initial images
    await loadImages();

    console.log('✅ Pixnix ready!');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ================================
// Utility Functions
// ================================

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================
// Service Worker (Optional)
// ================================

// Register service worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
