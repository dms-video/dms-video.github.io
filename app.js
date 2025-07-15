// S Line Hub Application JavaScript

// Initialize episodes data
let episodes = [
    {"number": 1, "title": "Episode 1", "release_date": "2025-07-11", "video_url": "https://dms.uom.lk/s/7scQjndkamHBt8W"},
    {"number": 2, "title": "Episode 2", "release_date": "2025-07-11", "video_url": ""},
    {"number": 3, "title": "Episode 3", "release_date": "2025-07-18", "video_url": ""},
    {"number": 4, "title": "Episode 4", "release_date": "2025-07-18", "video_url": ""},
    {"number": 5, "title": "Episode 5", "release_date": "2025-07-25", "video_url": ""},
    {"number": 6, "title": "Episode 6", "release_date": "2025-07-25", "video_url": ""}
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Handle initial route
    handleRoute();
    
    // Handle browser back/forward
    window.addEventListener('hashchange', handleRoute);
});

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.hash = href;
            
            // Close mobile menu if open
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Watch Episodes button
    const watchButton = document.querySelector('a[href="#episodes"]');
    if (watchButton) {
        watchButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.hash = '#episodes';
        });
    }
    
    // Upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
        
        // Form validation
        const formInputs = uploadForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('input', validateUploadForm);
        });
    }
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const targetPage = hash.substring(1);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target page
    const targetPageElement = document.getElementById(targetPage);
    if (targetPageElement) {
        targetPageElement.classList.add('active');
    }
    
    // Add active class to corresponding nav links
    const activeNavLinks = document.querySelectorAll(`.nav-link[href="${hash}"]`);
    activeNavLinks.forEach(link => {
        link.classList.add('active');
    });
    
    // Handle specific page logic
    if (targetPage === 'episodes') {
        showEpisodesWithLoader();
    }
}

function showEpisodesWithLoader() {
    const loader = document.getElementById('loader');
    const episodesGrid = document.getElementById('episodes-grid');
    
    if (loader && episodesGrid) {
        // Show loader
        loader.classList.remove('hidden');
        episodesGrid.innerHTML = '';
        
        // Hide loader and show episodes after 800ms
        setTimeout(() => {
            loader.classList.add('hidden');
            renderEpisodes();
        }, 800);
    }
}

function renderEpisodes() {
    const episodesGrid = document.getElementById('episodes-grid');
    if (!episodesGrid) return;
    
    episodesGrid.innerHTML = '';
    
    episodes.forEach(episode => {
        const episodeCard = createEpisodeCard(episode);
        episodesGrid.appendChild(episodeCard);
    });
}

// function createEpisodeCard(episode) {
//     const card = document.createElement('div');
//     card.className = 'card episode-card';
    
//     const hasVideo = episode.video_url && episode.video_url.trim() !== '';
    
//     card.innerHTML = `
//         <div class="episode-info">
//             <div class="episode-number">Episode ${episode.number}</div>
//             <h3 class="episode-title">${episode.title}</h3>
//             <div class="episode-date">${formatDate(episode.release_date)}</div>
//         </div>
//         ${hasVideo ? `
//             <video controls style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem;">
//                 <source src="${episode.video_url}" type="video/mp4">
//                 Your browser does not support the video tag.
//             </video>
//         ` : `
//             <div class="coming-soon-overlay">
//                 <span>Coming Soon</span>
//             </div>
//         `}
//     `;
    
//     return card;
// }

function createEpisodeCard(episode) {
    const card = document.createElement('div');
    card.className = 'card episode-card';

    const videoUrl = EpisodeVideoService.getVideoUrl(episode.number);
    const downloadUrl = EpisodeVideoService.getDownloadUrl(episode.number);
    const hasVideo = videoUrl && videoUrl.trim() !== '';

    card.innerHTML = `
        <div class="episode-info">
            <div class="episode-number">Episode ${episode.number}</div>
            <h3 class="episode-title">${episode.title}</h3>
            <div class="episode-date">${formatDate(episode.release_date)}</div>
        </div>
        ${hasVideo ? `
            <div class="episode-video-wrapper" style="margin-top: 1rem;">
                <video controls style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem;">
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <a href="${downloadUrl}" 
                   class="download-button" 
                   style="display: inline-block; margin-top: 0.5rem; text-decoration: none; color: #fff; background-color: #007BFF; padding: 0.5rem 1rem; border-radius: 0.3rem;">
                   ⬇ Download
                </a>
            </div>
        ` : `
            <div class="coming-soon-overlay">
                <span>Coming Soon</span>
            </div>
        `}
    `;

    return card;
}



function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function validateUploadForm() {
    const episodeNumber = document.getElementById('episode-number');
    const episodeTitle = document.getElementById('episode-title');
    const releaseDate = document.getElementById('release-date');
    const videoFile = document.getElementById('video-file');
    const addEpisodeBtn = document.getElementById('add-episode-btn');
    
    if (!episodeNumber || !episodeTitle || !releaseDate || !videoFile || !addEpisodeBtn) return;
    
    const isValid = episodeNumber.value && episodeTitle.value && releaseDate.value && videoFile.files[0];
    
    if (isValid) {
        addEpisodeBtn.classList.remove('disabled');
    } else {
        addEpisodeBtn.classList.add('disabled');
    }
}

function handleUploadSubmit(e) {
    e.preventDefault();
    
    const episodeNumber = parseInt(document.getElementById('episode-number').value);
    const episodeTitle = document.getElementById('episode-title').value;
    const releaseDate = document.getElementById('release-date').value;
    const videoFile = document.getElementById('video-file').files[0];
    
    // Validate all fields are filled
    if (!episodeNumber || !episodeTitle || !releaseDate || !videoFile) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate episode number range
    if (episodeNumber < 1 || episodeNumber > 6) {
        alert('Episode number must be between 1 and 6');
        return;
    }
    
    // Create object URL for the video file
    const videoUrl = URL.createObjectURL(videoFile);
    
    // Find and update the episode in the array
    const existingEpisodeIndex = episodes.findIndex(ep => ep.number === episodeNumber);
    if (existingEpisodeIndex !== -1) {
        episodes[existingEpisodeIndex] = {
            number: episodeNumber,
            title: episodeTitle,
            release_date: releaseDate,
            video_url: videoUrl
        };
    } else {
        // Add new episode if not found
        episodes.push({
            number: episodeNumber,
            title: episodeTitle,
            release_date: releaseDate,
            video_url: videoUrl
        });
    }
    
    // Sort episodes by number
    episodes.sort((a, b) => a.number - b.number);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.reset();
    }
    
    const addEpisodeBtn = document.getElementById('add-episode-btn');
    if (addEpisodeBtn) {
        addEpisodeBtn.classList.add('disabled');
    }
    
    // Navigate to episodes page after a short delay
    setTimeout(() => {
        window.location.hash = '#episodes';
    }, 1500);
}

function showSuccessMessage() {
    const uploadForm = document.getElementById('upload-form');
    if (!uploadForm) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Episode uploaded successfully! Redirecting to Episodes page...';
    
    // Insert before the form
    const formContainer = uploadForm.parentNode;
    formContainer.insertBefore(successDiv, uploadForm);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Clean up object URLs when page is unloaded to prevent memory leaks
window.addEventListener('beforeunload', function() {
    episodes.forEach(episode => {
        if (episode.video_url && episode.video_url.startsWith('blob:')) {
            URL.revokeObjectURL(episode.video_url);
        }
    });
});

// Ensure navigation works properly
window.addEventListener('load', function() {
    if (!window.location.hash) {
        window.location.hash = '#home';
    }
});

// Disable right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Block common inspect element shortcuts
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) {
        e.preventDefault();
    }
    // Ctrl+U (view source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
});
