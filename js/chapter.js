// Add this to your existing chapter.js file

// Handle file uploads
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('page-upload');
            const pageNumber = document.getElementById('page-number').value;
            const pageDescription = document.getElementById('page-description').value;
            
            if (!fileInput.files.length) {
                alert('Please select a file to upload');
                return;
            }
            
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create a new page element
                const comicPages = document.querySelector('.comic-pages');
                const newPage = document.createElement('div');
                newPage.classList.add('comic-page');
                
                // Create image element
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Chapter 1 Page ${pageNumber}`;
                
                // Create page info
                const pageInfo = document.createElement('p');
                pageInfo.classList.add('page-info');
                pageInfo.textContent = pageDescription || `Page ${pageNumber}`;
                
                // Create page number
                const pageNumberElement = document.createElement('div');
                pageNumberElement.classList.add('page-number');
                pageNumberElement.textContent = pageNumber;
                
                // Append elements
                newPage.appendChild(img);
                newPage.appendChild(pageInfo);
                newPage.appendChild(pageNumberElement);
                
                // Add to comic pages
                comicPages.appendChild(newPage);
                
                // Reset form
                uploadForm.reset();
                
                // Success message
                alert('Page uploaded successfully!');
                
                // Re-initialize page navigation
                initializePageNavigation();
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // Function to initialize page navigation
    function initializePageNavigation() {
        const comicPages = document.querySelectorAll('.comic-page');
        
        comicPages.forEach((page, index) => {
            // Remove existing navigation if any
            const existingNav = page.querySelector('.page-navigation');
            if (existingNav) {
                existingNav.remove();
            }
            
            // Create new navigation
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
    }
    
    // Initialize page navigation on load
    initializePageNavigation();
});

// Chapter navigation and comment system functionality

document.addEventListener('DOMContentLoaded', function() {
    // Chapter navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const homeBtn = document.querySelector('.home-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const prevChapter = this.getAttribute('data-prev');
            if (prevChapter) {
                window.location.href = prevChapter;
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const nextChapter = this.getAttribute('data-next');
            if (nextChapter) {
                window.location.href = nextChapter;
            }
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = '/index.html';
        });
    }
    
    // Comment system (simple version without Firebase)
    const commentForm = document.querySelector('.comment-form');
    const commentsContainer = document.querySelector('.comments-container');
    
    if (commentForm && commentsContainer) {
        // Load existing comments from localStorage
        loadComments();
        
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('comment-name');
            const commentInput = document.getElementById('comment-text');
            
            const name = nameInput.value.trim() || 'Anonymous';
            const comment = commentInput.value.trim();
            
            if (comment) {
                // Save comment
                saveComment(name, comment);
                
                // Clear form
                nameInput.value = '';
                commentInput.value = '';
                
                // Show notification
                showNotification('Your comment has been posted!');
                
                // Reload comments
                loadComments();
            } else {
                showNotification('Please enter a comment.', 'error');
            }
        });
    }
    
    // Email subscription
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Save email to localStorage
                saveSubscriber(email);
                
                // Clear form
                emailInput.value = '';
                
                // Show notification
                showNotification('Thanks for subscribing! You\'ll receive updates when new chapters are released.');
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

// Save comment to localStorage
function saveComment(name, text) {
    const chapterId = getCurrentChapterId();
    
    // Get existing comments
    let comments = JSON.parse(localStorage.getItem(`comments_${chapterId}`) || '[]');
    
    // Add new comment
    comments.push({
        name: name,
        text: text,
        date: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem(`comments_${chapterId}`, JSON.stringify(comments));
}

// Load comments from localStorage
function loadComments() {
    const commentsContainer = document.querySelector('.comments-container');
    if (!commentsContainer) return;
    
    const chapterId = getCurrentChapterId();
    
    // Get comments from localStorage
    const comments = JSON.parse(localStorage.getItem(`comments_${chapterId}`) || '[]');
    
    // Clear container
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">Be the first to comment!</p>';
        return;
    }
    
    // Sort comments by date (newest first)
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add comments to container
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <h4>${escapeHTML(comment.name)}</h4>
                <span class="comment-date">${formatDate(new Date(comment.date))}</span>
            </div>
            <div class="comment-body">
                <p>${escapeHTML(comment.text)}</p>
            </div>
        `;
        
        commentsContainer.appendChild(commentElement);
    });
}

// Save subscriber to localStorage
function saveSubscriber(email) {
    // Get existing subscribers
    let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    // Check if email already exists
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        
        // Save back to localStorage
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
}

// Helper functions
function getCurrentChapterId() {
    // Extract chapter ID from URL or data attribute
    const chapterContainer = document.querySelector('.chapter-container');
    if (chapterContainer && chapterContainer.dataset.chapterId) {
        return chapterContainer.dataset.chapterId;
    }
    
    // Extract from URL
    const path = window.location.pathname;
    const match = path.match(/chapter(\d+)/i);
    return match ? match[1] : 'unknown';
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}