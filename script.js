const tracks = [
  { title: 'Midnight Drive', artist: 'Luna Echo' },
  { title: 'City Lights', artist: 'Neon Avenue' },
  { title: 'Ocean Eyes', artist: 'Harbor Bloom' },
  { title: 'Sunset Pulse', artist: 'Retro Tide' },
  { title: 'Skyline Rhythm', artist: 'North Frequency' },
];

const trackList = document.getElementById('trackList');
const searchInput = document.getElementById('searchInput');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const playbackSlider = document.getElementById('playbackSlider');
const videoPlayer = document.getElementById('videoPlayer');

let filteredTracks = [...tracks];
let currentTrackIndex = 0;
let isPlaying = false;

function renderTracks() {
  trackList.innerHTML = '';

  filteredTracks.forEach((track, index) => {
    const li = document.createElement('li');
    const isActive = tracks[currentTrackIndex]?.title === track.title;
    li.className = isActive ? 'active' : '';
    li.innerHTML = `<span>${track.title}</span><small>${track.artist}</small>`;

    li.addEventListener('click', () => {
      const absoluteIndex = tracks.findIndex((item) => item.title === track.title);
      if (absoluteIndex >= 0) {
        currentTrackIndex = absoluteIndex;
        updateNowPlaying();
        renderTracks();
      }
    });

    trackList.appendChild(li);
  });
}

function updateNowPlaying() {
  const track = tracks[currentTrackIndex];
  if (!track) return;
  currentTitle.textContent = track.title;
  currentArtist.textContent = track.artist;
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? '⏸' : '▶️';

  if (isPlaying) {
    videoPlayer.play().catch(() => {
      isPlaying = false;
      playPauseBtn.textContent = '▶️';
    });
  } else {
    videoPlayer.pause();
  }
}

function moveTrack(direction) {
  currentTrackIndex =
    (currentTrackIndex + direction + tracks.length) % tracks.length;
  updateNowPlaying();
  renderTracks();
}

searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term)
  );
  renderTracks();
});

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', () => moveTrack(-1));
nextBtn.addEventListener('click', () => moveTrack(1));

volumeSlider.addEventListener('input', (e) => {
  videoPlayer.volume = Number(e.target.value) / 100;
});

videoPlayer.addEventListener('timeupdate', () => {
  if (!Number.isFinite(videoPlayer.duration) || videoPlayer.duration === 0) return;
  playbackSlider.value = (videoPlayer.currentTime / videoPlayer.duration) * 100;
});

playbackSlider.addEventListener('input', (e) => {
  if (!Number.isFinite(videoPlayer.duration) || videoPlayer.duration === 0) return;
  const percent = Number(e.target.value) / 100;
  videoPlayer.currentTime = percent * videoPlayer.duration;
});

updateNowPlaying();
renderTracks();
videoPlayer.volume = Number(volumeSlider.value) / 100;
