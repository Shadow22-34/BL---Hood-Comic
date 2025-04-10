// Email Subscription and Comment System

// Initialize Firebase (you'll need to add your Firebase config)
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is already loaded
    if (typeof firebase === 'undefined') {
        // Add Firebase SDK script dynamically
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
        firebaseScript.onload = function() {
            // Load additional Firebase services
            const services = [
                'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
                'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
            ];
            
            let loaded = 0;
            services.forEach(service => {
                const script = document.createElement('script');
                script.src = service;
                script.onload = function() {
                    loaded++;
                    if (loaded === services.length) {
                        initializeFirebase();
                    }
                };
                document.head.appendChild(script);
            });
        };
        document.head.appendChild(firebaseScript);
    } else {
        initializeFirebase();
    }
});

function initializeFirebase() {
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    };
    
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Initialize Firestore
    const db = firebase.firestore();
    
    // Handle email subscription
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Add email to subscribers collection
                db.collection('subscribers').add({
                    email: email,
                    subscribedAt: new Date(),
                    active: true
                })
                .then(() => {
                    showNotification('Thanks for subscribing! You\'ll receive updates when new chapters are released.');
                    emailInput.value = '';
                    
                    // Send welcome email
                    sendWelcomeEmail(email);
                })
                .catch(error => {
                    console.error("Error adding subscriber: ", error);
                    showNotification('Something went wrong. Please try again.', 'error');
                });
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Handle comments
    const commentForm = document.querySelector('.comment-form');
    const commentsContainer = document.querySelector('.comments-container');
    
    if (commentForm && commentsContainer) {
        // Get chapter ID from URL or data attribute
        const chapterId = document.querySelector('.chapter-container').dataset.chapterId || 
                          window.location.pathname.split('/').pop().replace('.html', '');
        
        // Load existing comments
        loadComments(db, chapterId, commentsContainer);
        
        // Handle new comment submission
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textarea = this.querySelector('textarea');
            const commentText = textarea.value.trim();
            const nameInput = this.querySelector('input[name="name"]') || { value: 'Anonymous' };
            const name = nameInput.value.trim() || 'Anonymous';
            
            if (commentText) {
                // Add comment to database
                db.collection('chapters').doc(chapterId).collection('comments').add({
                    name: name,
                    text: commentText,
                    createdAt: new Date()
                })
                .then(() => {
                    textarea.value = '';
                    if (nameInput.value) nameInput.value = '';
                    showNotification('Your comment has been posted!');
                    
                    // Reload comments
                    loadComments(db, chapterId, commentsContainer);
                })
                .catch(error => {
                    console.error("Error adding comment: ", error);
                    showNotification('Something went wrong. Please try again.', 'error');
                });
            } else {
                showNotification('Please enter a comment.', 'error');
            }
        });
    }
}

// Load comments from database
function loadComments(db, chapterId, container) {
    db.collection('chapters').doc(chapterId).collection('comments')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            container.innerHTML = '';
            
            if (querySnapshot.empty) {
                container.innerHTML = '<p class="no-comments">Be the first to comment!</p>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const comment = doc.data();
                const date = comment.createdAt.toDate ? 
                             comment.createdAt.toDate() : 
                             new Date(comment.createdAt);
                
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <h4>${escapeHTML(comment.name)}</h4>
                        <span class="comment-date">${formatDate(date)}</span>
                    </div>
                    <div class="comment-body">
                        <p>${escapeHTML(comment.text)}</p>
                    </div>
                `;
                
                container.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error("Error loading comments: ", error);
            container.innerHTML = '<p class="error">Failed to load comments. Please refresh the page.</p>';
        });
}

// Send welcome email to new subscribers
function sendWelcomeEmail(email) {
    // This would typically be handled by a server-side function
    // For demonstration, we'll log it to console
    console.log(`Welcome email would be sent to ${email}`);
    
    // In a real implementation, you would use a service like Firebase Cloud Functions
    // to send emails with your custom template
}

// Notify subscribers when a new chapter is released
function notifySubscribers(chapterTitle, chapterUrl) {
    // This would be triggered by an admin when publishing a new chapter
    // For demonstration purposes only
    console.log(`Notifying subscribers about new chapter: ${chapterTitle}`);
    
    // In a real implementation, this would be handled by a server-side function
}

// Helper functions
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}