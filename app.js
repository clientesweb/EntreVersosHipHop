// Replace with your actual YouTube API key
const API_KEY = 'AIzaSyBf5wzygVChOBD-3pPb4BR2v5NA4uE9J5c';

let youtubeAPIReady = false;

// Load YouTube API
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API Ready callback
window.onYouTubeIframeAPIReady = function() {
  console.log('YouTube API is ready');
  youtubeAPIReady = true;
  fetchPlaylists();
  fetchShorts();
};

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
  if (!youtubeAPIReady) {
    console.log('YouTube API not ready yet. Waiting to fetch playlists...');
    setTimeout(fetchPlaylists, 1000);
    return;
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=UCKe78SZ-nI7IA-afVIdtjFg&maxResults=10&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Playlists data:', data);
    
    const playlistsContainer = document.getElementById('playlistsContainer');
    if (!playlistsContainer) {
      console.error('Playlists container not found in the DOM');
      return;
    }
    
    data.items.forEach(playlist => {
      const playlistElement = document.createElement('div');
      playlistElement.className = 'swiper-slide bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105';
      playlistElement.innerHTML = `
        <div id="player-${playlist.id}" class="w-full h-48"></div>
        <div class="p-4">
          <h3 class="text-xl font-bold mb-2 text-orange-500">${playlist.snippet.title}</h3>
          <p class="text-gray-400">${playlist.snippet.description.slice(0, 100)}...</p>
        </div>
      `;
      playlistsContainer.appendChild(playlistElement);

      // Create YouTube player
      new YT.Player(`player-${playlist.id}`, {
        height: '100%',
        width: '100%',
        videoId: playlist.snippet.resourceId.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
        },
      });
    });

    // Reinitialize the Swiper for playlists
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

  } catch (error) {
    console.error('Error fetching playlists:', error);
  }
}

// Fetch shorts
async function fetchShorts() {
  if (!youtubeAPIReady) {
    console.log('YouTube API not ready yet. Waiting to fetch shorts...');
    setTimeout(fetchShorts, 1000);
    return;
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCKe78SZ-nI7IA-afVIdtjFg&type=video&videoDuration=short&maxResults=10&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Shorts data:', data);
    
    const shortsContainer = document.getElementById('shortsContainer');
    if (!shortsContainer) {
      console.error('Shorts container not found in the DOM');
      return;
    }
    
    data.items.forEach(short => {
      const shortElement = document.createElement('div');
      shortElement.className = 'bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105';
      shortElement.innerHTML = `
        <div id="short-${short.id.videoId}" class="w-full h-64"></div>
        <div class="p-2">
          <h4 class="text-sm font-bold text-orange-500">${short.snippet.title}</h4>
        </div>
      `;
      shortsContainer.appendChild(shortElement);

      // Create YouTube player for shorts
      new YT.Player(`short-${short.id.videoId}`, {
        height: '100%',
        width: '100%',
        videoId: short.id.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          loop: 1,
          playlist: short.id.videoId,
        },
      });
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
  const modalArtistImage =   document.getElementById('modalArtistImage');
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
  createSponsorSlider();
  createArtistsSection();
  initMap();
  reveal();
  loadYouTubeAPI();
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