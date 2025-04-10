// Email subscription system with EmailJS integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    (function() {
        emailjs.init("6SdkdsCHS4VdS4woo"); // Your EmailJS public key
    })();
    
    // Email subscription form
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Save subscriber
                saveSubscriber(email);
                
                // Show loading notification
                showEmailNotification('Processing subscription...', 'info');
                
                // Send actual email
                sendRealEmail(email);
                
                // Show preview for testing
                showEmailPreview(email);
                
                // Clear form
                emailInput.value = '';
                
                // Show success notification
                showEmailNotification('Thanks for subscribing! You\'ll receive updates when new chapters are released.', 'success');
            } else {
                showEmailNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

// Save subscriber to localStorage
function saveSubscriber(email) {
    // Get existing subscribers
    let subscribers = JSON.parse(localStorage.getItem('bl_hoodz_subscribers') || '[]');
    
    // Check if email already exists
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        
        // Save back to localStorage
        localStorage.setItem('bl_hoodz_subscribers', JSON.stringify(subscribers));
        console.log(`Subscriber ${email} added successfully`);
    } else {
        console.log(`Subscriber ${email} already exists`);
    }
}

// Show email preview for testing
function showEmailPreview(email) {
    // Create email preview modal
    const modal = document.createElement('div');
    modal.className = 'email-preview-modal';
    
    const emailTemplate = `
        <div class="email-template">
            <div class="email-content">
                <div class="email-header">
                    <h2>BL·HOODZ</h2>
                    <p>Welcome to our comic community!</p>
                </div>
                <div class="email-body">
                    <h3>THANK YOU FOR SUBSCRIBING!</h3>
                    <p>Dear Reader,</p>
                    <p>Thank you for subscribing to BL·HOODZ Comic updates. You'll now receive notifications whenever a new chapter is released.</p>
                    <p>We're excited to have you join our community of readers!</p>
                    <div class="email-cta">
                        <a href="#" class="email-button">READ LATEST CHAPTER</a>
                    </div>
                    <p>If you have any questions or feedback, feel free to reply to this email.</p>
                    <p>Happy reading!</p>
                    <p>- The BL·HOODZ Team</p>
                </div>
                <div class="email-footer">
                    <p>This email was sent to ${email}</p>
                    <p>&copy; 2023 BL·HOODZ Comic. All rights reserved.</p>
                </div>
            </div>
        </div>
        <button class="close-preview">CLOSE PREVIEW</button>
    `;
    
    modal.innerHTML = emailTemplate;
    document.body.appendChild(modal);
    
    // Add event listener to close button
    modal.querySelector('.close-preview').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// Show email notification
function showEmailNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.email-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `email-notification ${type}`;
    notification.innerHTML = `
        ${message}
        <button class="email-notification-close">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.email-notification-close').addEventListener('click', function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Check if email is valid
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Admin function to view all subscribers
function viewAllSubscribers() {
    const subscribers = JSON.parse(localStorage.getItem('bl_hoodz_subscribers') || '[]');
    console.table(subscribers);
    return subscribers;
}

// Admin function to view all sent emails
function viewAllSentEmails() {
    const sentEmails = JSON.parse(localStorage.getItem('bl_hoodz_sent_emails') || '[]');
    console.table(sentEmails);
    return sentEmails;
}

// Send real email using EmailJS
function sendRealEmail(email) {
    // Prepare template parameters
    const templateParams = {
        to_email: email,
        to_name: email.split('@')[0], // Use part before @ as name
        from_name: "BL·HOODZ",
        from_email: "updates@blhoodz.com", // Replace with your actual sending email
        subject: "Welcome to BL·HOODZ!",
        reply_to: "support@blhoodz.com", // Support email for replies
        company_name: "BL·HOODZ",
        company_email: "support@blhoodz.com", // Replace with your actual support email
        website_link: "https://blhoodz.com" // Replace with your actual website URL
    };
    
    // Send email using EmailJS
    emailjs.send('service_q6mu0if', 'template_wo42q3w', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showEmailNotification('Thanks for subscribing! Welcome email has been sent to your inbox.', 'success');
            
            // Save sent email record
            saveSentEmail(email);
        }, function(error) {
            console.error('Email sending failed:', error);
            showEmailNotification('Subscription successful, but there was an issue sending the welcome email.', 'error');
        });
}

// Save record of sent email
function saveSentEmail(email) {
    // Get existing sent emails
    let sentEmails = JSON.parse(localStorage.getItem('bl_hoodz_sent_emails') || '[]');
    
    // Add new record
    sentEmails.push({
        email: email,
        timestamp: new Date().toISOString(),
        type: 'welcome'
    });
    
    // Save back to localStorage
    localStorage.setItem('bl_hoodz_sent_emails', JSON.stringify(sentEmails));
}

// Test function to quickly test email sending
function testEmailSubscription(email = 'test@example.com') {
    if (!email || !isValidEmail(email)) {
        console.error('Please provide a valid email address');
        return;
    }
    
    console.log(`Testing email subscription with: ${email}`);
    
    // Save subscriber
    saveSubscriber(email);
    
    // Show loading notification
    showEmailNotification('Testing: Processing subscription...', 'info');
    
    // Send actual email
    sendRealEmail(email);
    
    // Show preview for testing
    showEmailPreview(email);
    
    return `Test initiated for ${email}. Check console for results.`;
}

// Make test function globally accessible - this is the important part
window.testEmailSubscription = testEmailSubscription;

// Also expose other admin functions globally
window.viewAllSubscribers = viewAllSubscribers;
window.viewAllSentEmails = viewAllSentEmails;