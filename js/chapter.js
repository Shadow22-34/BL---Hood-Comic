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