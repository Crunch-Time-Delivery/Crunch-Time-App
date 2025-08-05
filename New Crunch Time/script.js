document.addEventListener('DOMContentLoaded', () => {
    // Ensure the first slide is visible
    const slide = document.querySelector('#slide1');
    if (slide) {
        slide.classList.add('active');
    }

    // Optional: Handle click event on the background link
    const backgroundLink = document.querySelector('.background-link');
    backgroundLink.addEventListener('click', () => {
        console.log('Background image clicked, redirecting to:', backgroundLink.href);
        // The actual redirection is handled by the <a> tag's href attribute
    });
});
