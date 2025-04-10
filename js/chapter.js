document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const comicPages = document.querySelectorAll('.comic-page');
    const optionsToggle = document.querySelector('.options-toggle');
    const readingOptions = document.querySelector('.reading-options');
    const progressBar = document.querySelector('.chapter-progress');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const readingModeSelect = document.getElementById('reading-mode');
    const zoomToggle = document.getElementById('zoom-toggle');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const autoScrollToggle = document.getElementById('auto-scroll-toggle');
    
    // Initialize page numbers
    comicPages.forEach((page, index) => {
        const pageNumber = document.createElement('div');
        pageNumber.classList.add('page-number');
        pageNumber.textContent = index + 1;
        page.appendChild(pageNumber);
    });
    
    // Toggle reading options panel
    if (optionsToggle) {
        optionsToggle.addEventListener('click', function() {
            readingOptions.classList.toggle('active');
        });
    }
    
    // Update progress bar as user scrolls
    window.addEventListener('scroll', function() {
        if (progressBar) {
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / fullHeight) * 100;
            progressBar.style.width = progress + '%';
        }
    });
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
            localStorage.setItem('darkMode', this.checked);
        });
        
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = savedDarkMode;
        document.body.classList.toggle('dark-mode', savedDarkMode);
    }
    
    // Font size adjustment
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            const size = this.value;
            document.documentElement.style.setProperty('--font-size-base', size + 'px');
            localStorage.setItem('fontSize', size);
        });
        
        // Check for saved font size
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            fontSizeSlider.value = savedFontSize;
            document.documentElement.style.setProperty('--font-size-base', savedFontSize + 'px');
        }
    }
    
    // Reading mode selection
    if (readingModeSelect) {
        readingModeSelect.addEventListener('change', function() {
            const mode = this.value;
            document.body.className = document.body.className.replace(/reading-mode-\w+/g, '');
            document.body.classList.add('reading-mode-' + mode);
            localStorage.setItem('readingMode', mode);
        });
        
        // Check for saved reading mode
        const savedReadingMode = localStorage.getItem('readingMode');
        if (savedReadingMode) {
            readingModeSelect.value = savedReadingMode;
            document.body.classList.add('reading-mode-' + savedReadingMode);
        }
    }
    
    // Zoom toggle
    if (zoomToggle) {
        zoomToggle.addEventListener('change', function() {
            comicPages.forEach(page => {
                page.classList.toggle('zoom-enabled', this.checked);
            });
            localStorage.setItem('zoomEnabled', this.checked);
        });
        
        // Check for saved zoom preference
        const savedZoom = localStorage.getItem('zoomEnabled') === 'true';
        zoomToggle.checked = savedZoom;
        comicPages.forEach(page => {
            page.classList.toggle('zoom-enabled', savedZoom);
        });
    }
    
    // Fullscreen mode
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('change', function() {
            document.body.classList.toggle('fullscreen-mode', this.checked);
        });
    }
    
    // Auto-scroll functionality
    let autoScrollInterval;
    if (autoScrollToggle) {
        autoScrollToggle.addEventListener('change', function() {
            if (this.checked) {
                autoScrollInterval = setInterval(() => {
                    window.scrollBy({
                        top: 1,
                        behavior: 'smooth'
                    });
                }, 50);
            } else {
                clearInterval(autoScrollInterval);
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            window.scrollBy({
                top: -window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        }
    });
    
    // Double-click to enter/exit fullscreen for a page
    comicPages.forEach(page => {
        page.addEventListener('dblclick', function() {
            if (!document.body.classList.contains('fullscreen-mode')) {
                this.classList.add('fullscreen');
                document.body.style.overflow = 'hidden';
            } else {
                document.querySelectorAll('.comic-page.fullscreen').forEach(p => {
                    p.classList.remove('fullscreen');
                });
                document.body.style.overflow = '';
            }
        });
    });
    
    // Add page navigation buttons
    comicPages.forEach((page, index) => {
        const navigation = document.createElement('div');
        navigation.classList.add('page-navigation');
        
        if (index > 0) {
            const prevButton = document.createElement('div');
            prevButton.classList.add('page-nav-button', 'prev-page');
            prevButton.innerHTML = '&larr;';
            prevButton.addEventListener('click', function(e) {
                e.stopPropagation();
                comicPages[index - 1].scrollIntoView({ behavior: 'smooth' });
            });
            navigation.appendChild(prevButton);
        } else {
            // Add empty div for spacing
            navigation.appendChild(document.createElement('div'));
        }
        
        if (index < comicPages.length - 1) {
            const nextButton = document.createElement('div');
            nextButton.classList.add('page-nav-button', 'next-page');
            nextButton.innerHTML = '&rarr;';
            nextButton.addEventListener('click', function(e) {
                e.stopPropagation();
                comicPages[index + 1].scrollIntoView({ behavior: 'smooth' });
            });
            navigation.appendChild(nextButton);
        } else {
            // Add empty div for spacing
            navigation.appendChild(document.createElement('div'));
        }
        
        page.appendChild(navigation);
    });
});