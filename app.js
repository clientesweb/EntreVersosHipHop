// Replace with your actual YouTube API key
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

// PWA installation
let deferredPrompt;
const installButton = document.getElementById('installPWA');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.classList.remove('hidden');
});

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  }
  installButton.classList.add('hidden');
});

// Initialize Swiper
function initSwipers() {
  new Swiper('.top-banner-swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 5000,
    },
  });

  new Swiper('.hero-swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  });

  new Swiper('.playlist-swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });

  new Swiper('.sponsor-swiper', {
    slidesPerView: 2,
    spaceBetween: 10,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
    },
  });
}

// Fetch playlists
async function fetchPlaylists() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=YOUR_CHANNEL_ID&maxResults=10&key=${API_KEY}`);
    const data = await response.json();
    const playlistsContainer = document.getElementById('playlistsContainer');
    
    data.items.forEach(playlist => {
      const playlistElement = document.createElement('div');
      playlistElement.className = 'swiper-slide bg-gray-800 rounded-lg overflow-hidden shadow-lg';
      playlistElement.innerHTML = `
        <img src="${playlist.snippet.thumbnails.medium.url}" alt="${playlist.snippet.title}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-xl font-bold mb-2 text-orange-600">${playlist.snippet.title}</h3>
          <p class="text-gray-400">${playlist.snippet.description.slice(0, 100)}...</p>
        </div>
      `;
      playlistsContainer.appendChild(playlistElement);
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
  }
}

// Fetch shorts
async function fetchShorts() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=YOUR_CHANNEL_ID&type=video&videoDuration=short&maxResults=10&key=${API_KEY}`);
    const data = await response.json();
    const shortsContainer = document.getElementById('shortsContainer');
    
    data.items.forEach(short => {
      const shortElement = document.createElement('div');
      shortElement.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg';
      shortElement.innerHTML = `
        <img src="${short.snippet.thumbnails.medium.url}" alt="${short.snippet.title}" class="w-full h-36 object-cover">
        <div class="p-2">
          <h4 class="text-sm font-bold text-orange-600">${short.snippet.title}</h4>
        </div>
      `;
      shortsContainer.appendChild(shortElement);
    });
  } catch (error) {
    console.error('Error fetching shorts:', error);
  }
}

// Create sponsor slider
function createSponsorSlider() {
  const sponsors = [
    { name: 'Sponsor 1', logo: 'https://via.placeholder.com/150?text=Sponsor+1' },
    { name: 'Sponsor 2', logo: 'https://via.placeholder.com/150?text=Sponsor+2' },
    { name: 'Sponsor 3', logo: 'https://via.placeholder.com/150?text=Sponsor+3' },
    { name: 'Sponsor 4', logo: 'https://via.placeholder.com/150?text=Sponsor+4' },
    { name: 'Sponsor 5', logo: 'https://via.placeholder.com/150?text=Sponsor+5' },
  ];

  const sponsorSlider = document.getElementById('sponsorSlider');
  sponsors.forEach(sponsor => {
    const sponsorElement = document.createElement('div');
    sponsorElement.className = 'swiper-slide flex justify-center items-center';
    sponsorElement.innerHTML = `
      <img src="${sponsor.logo}" alt="${sponsor.name}" class="w-32 h-32 object-contain">
    `;
    sponsorSlider.appendChild(sponsorElement);
  });
}

// Initialize map
function initMap() {
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('Entre Versos Hip Hop<br>Estudio Principal')
    .openPopup();
}

// Initialize app
function init() {
  initSwipers();
  fetchPlaylists();
  fetchShorts();
  createSponsorSlider();
  initMap();
}

// Run init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);