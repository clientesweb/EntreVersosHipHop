// Replace with your actual YouTube API key
const API_KEY = 'AIzaSyBf5wzygVChOBD-3pPb4BR2v5NA4uE9J5c';

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

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.classList.add('hidden');
});

// Reveal animations
const reveal = () => {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', reveal);

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

  new Swiper('.about-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  new Swiper('.artist-swiper', {
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
}

// Fetch playlists
async function fetchPlaylists() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=UCKe78SZ-nI7IA-afVIdtjFg&maxResults=10&key=${API_KEY}`);
    const data = await response.json();
    console.log('Playlists data:', data); // Log the data to check what we're receiving
    const playlistsContainer = document.getElementById('playlistsContainer');
    
    if (!playlistsContainer) {
      console.error('Playlists container not found in the DOM');
      return;
    }
    
    playlistsContainer.innerHTML = ''; // Clear existing content
    
    if (!data.items || data.items.length === 0) {
      console.log('No playlists found');
      playlistsContainer.innerHTML = '<p class="text-center text-gray-500">No playlists available at the moment.</p>';
      return;
    }
    
    data.items.forEach(playlist => {
      const playlistElement = document.createElement('div');
      playlistElement.className = 'swiper-slide';
      playlistElement.innerHTML = `
        <div class="bg-white rounded-lg overflow-hidden shadow-lg">
          <div class="relative">
            <img src="${playlist.snippet.thumbnails.medium.url}" alt="${playlist.snippet.title}" class="w-full h-48 object-cover">
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              PLAYLIST
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2">${playlist.snippet.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">${playlist.snippet.description}</p>
            <button onclick="playPlaylist('${playlist.id}')" class="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center w-full">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4l12 6-12 6z"/>
              </svg>
              Reproducir todo
            </button>
          </div>
        </div>
      `;
      playlistsContainer.appendChild(playlistElement);
    });

    // Reinitialize Swiper
    new Swiper('.playlist-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
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
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
  }
}

// Fetch shorts
async function fetchShorts() {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCKe78SZ-nI7IA-afVIdtjFg&type=video&videoDuration=short&maxResults=10&key=${API_KEY}`);
    const data = await response.json();
    console.log('Shorts data:', data); // Log the data to check what we're receiving
    const shortsContainer = document.getElementById('shortsContainer');
    
    if (!shortsContainer) {
      console.error('Shorts container not found in the DOM');
      return;
    }
    
    shortsContainer.innerHTML = ''; // Clear existing content
    
    if (!data.items || data.items.length === 0) {
      console.log('No shorts found');
      shortsContainer.innerHTML = '<p class="text-center text-gray-500">No shorts available at the moment.</p>';
      return;
    }
    
    data.items.forEach(short => {
      const shortElement = document.createElement('div');
      shortElement.className = 'relative w-full pb-[177.77%] bg-gray-100 rounded-lg overflow-hidden shadow-lg';
      shortElement.innerHTML = `
        <img src="${short.snippet.thumbnails.medium.url}" alt="${short.snippet.title}" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
          <h4 class="text-white font-semibold line-clamp-2">${short.snippet.title}</h4>
        </div>
        <button onclick="playShort('${short.id.videoId}')" class="absolute inset-0 w-full h-full flex items-center justify-center">
          <svg class="w-16 h-16 text-white opacity-80 hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4l12 6-12 6z"/>
          </svg>
        </button>
      `;
      shortsContainer.appendChild(shortElement);
    });
  } catch (error) {
    console.error('Error fetching shorts:', error);
  }
}

// Function to play a playlist
function playPlaylist(playlistId) {
  console.log('Playing playlist:', playlistId); // Log the playlist ID
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-4xl">
      <div class="relative pt-[56.25%]">
        <iframe 
          src="https://www.youtube.com/embed/videoseries?list=${playlistId}" 
          class="absolute inset-0 w-full h-full"
          frameborder="0" 
          allow="autoplay; encrypted-media" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="p-4 flex justify-end">
        <button onclick="closeModal(this)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Cerrar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Function to play a short
function playShort(videoId) {
  console.log('Playing short:', videoId); // Log the video ID
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-sm">
      <div class="relative pt-[177.77%]">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          class="absolute inset-0 w-full h-full"
          frameborder="0" 
          allow="autoplay; encrypted-media" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="p-4 flex justify-end">
        <button onclick="closeModal(this)" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Cerrar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Function to close modal
function closeModal(button) {
  const modal = button.closest('.fixed');
  modal.remove();
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
      <img data-src="${sponsor.logo}" alt="${sponsor.name}" class="lazyload w-32 h-32 object-contain">
    `;
    sponsorSlider.appendChild(sponsorElement);
  });
}

// Create artists section
const artists = [
  { 
    name: 'MC Rítmico', 
    image: 'https://source.unsplash.com/random/400x400?rapper', 
    description: 'Maestro del flow y las rimas ingeniosas',
    type: 'mc',
    social: {
      instagram: 'mc_ritmico',
      twitter: 'mc_ritmico',
      youtube: 'MCRitmico'
    },
    music: ['VIDEO_ID_1', 'VIDEO_ID_2']
  },
  { 
    name: 'DJ Scratch', 
    image: 'https://source.unsplash.com/random/400x400?dj', 
    description: 'Virtuoso de los platos y creador de beats únicos',
    type: 'dj',
    social: {
      instagram: 'dj_scratch',
      twitter: 'dj_scratch',
      youtube: 'DJScratch'
    },
    music: ['VIDEO_ID_3', 'VIDEO_ID_4']
  },
  { 
    name: 'B-Girl Flex', 
    image: 'https://source.unsplash.com/random/400x400?dancer', 
    description: 'Reina del breakdance y la expresión corporal',
    type: 'dancer',
    social: {
      instagram: 'bgirl_flex',
      twitter: 'bgirl_flex',
      youtube: 'BGirlFlex'
    },
    music: ['VIDEO_ID_5', 'VIDEO_ID_6']
  },
  { 
    name: 'Grafitero Urbano', 
    image: 'https://source.unsplash.com/random/400x400?graffiti', 
    description: 'Artista visual que da color a nuestros eventos',
    type: 'graffiti',
    social: {
      instagram: 'grafitero_urbano',
      twitter: 'grafitero_urbano',
      youtube: 'GrafiteroUrbano'
    },
    
    music: ['VIDEO_ID_7', 'VIDEO_ID_8']
  },
];

function createArtistsSection() {
  const artistsContainer = document.getElementById('artistsContainer');
  artists.forEach(artist => {
    const artistElement = document.createElement('div');
    artistElement.className = 'swiper-slide artist-card bg-gray-800 rounded-lg overflow-hidden shadow-lg';
    artistElement.innerHTML = `
      <img data-src="${artist.image}" alt="${artist.name}" class="lazyload w-full h-64 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-bold mb-2 text-orange-500">${artist.name}</h3>
        <p class="text-gray-400">${artist.description}</p>
        <button class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105" onclick="openArtistModal('${artist.name}')">Ver más</button>
      </div>
    `;
    artistsContainer.appendChild(artistElement);
  });
}

function openArtistModal(artistName) {
  const artist = artists.find(a => a.name === artistName);
  if (!artist) return;

  const modal = document.getElementById('artistModal');
  const modalArtistName = document.getElementById('modalArtistName');
  const modalArtistImage = document.getElementById('modalArtistImage');
  const modalArtistDescription = document.getElementById('modalArtistDescription');
  const modalArtistSocial = document.getElementById('modalArtistSocial');
  const modalArtistMusic = document.getElementById('modalArtistMusic');

  modalArtistName.textContent = artist.name;
  modalArtistImage.src = artist.image;
  modalArtistImage.alt = artist.name;
  modalArtistDescription.textContent = artist.description;

  modalArtistSocial.innerHTML = '';
  for (const [platform, username] of Object.entries(artist.social)) {
    const link = document.createElement('a');
    link.href = `https://www.${platform}.com/${username}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `<i class="fab fa-${platform} text-2xl"></i>`;
    modalArtistSocial.appendChild(link);
  }

  modalArtistMusic.innerHTML = '';
  artist.music.forEach(videoId => {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '315';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    modalArtistMusic.appendChild(iframe);
  });

  modal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('artistModal').classList.add('hidden');
});

document.getElementById('artistFilter').addEventListener('change', (e) => {
  const filter = e.target.value;
  const artistCards = document.querySelectorAll('.artist-card');
  artistCards.forEach(card => {
    const artistName = card.querySelector('h3').textContent;
    const artist = artists.find(a => a.name === artistName);
    if (filter === 'all' || artist.type === filter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

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
  createArtistsSection();
  initMap();
  reveal();
}

// Run init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Lazy load images
document.addEventListener('lazyloaded', function(e) {
  e.target.parentNode.classList.add('image-loaded');
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}