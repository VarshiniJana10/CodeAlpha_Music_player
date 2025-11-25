// 3-song playlist
const playlist = [
  {
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    src: "sunflower.mp3",
    image: "sunflower.jpg",
    gradient: "linear-gradient(180deg, #a00020, #000000)",
    sourceText: '"sunflower" in Search',
    liked: false
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    src: "heatwaves.mp3",
    image: "heatwaves.jpg",
    gradient: "linear-gradient(180deg, #b020ff, #000000)",
    sourceText: '"heatwaves" in Search',
    liked: false
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    src: "shapeofyou.mp3",
    image: "shapeofyou.jpg",
    gradient: "linear-gradient(180deg, #0097c0, #000000)",
    sourceText: '"shape of you" in Search',
    liked: false
  }
];

let currentIndex = 0;
let isShuffle = false;

const audio = document.getElementById("audioPlayer");
const artEl = document.getElementById("trackImage");
const titleEl = document.getElementById("trackTitle");
const artistEl = document.getElementById("trackArtist");
const sourceEl = document.getElementById("topSource");
const overlay = document.querySelector(".overlay");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const shuffleBtn = document.getElementById("shuffleBtn");
const playBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");

const likeBtn = document.getElementById("likeBtn");
const addBtn = document.getElementById("addBtn");
const shareBtn = document.getElementById("shareBtn");

/* Load a track into UI */
function loadTrack(index) {
  currentIndex = index;
  const track = playlist[currentIndex];

  audio.src = track.src;
  artEl.src = track.image;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  sourceEl.textContent = track.sourceText;
  overlay.style.backgroundImage = track.gradient;

  // update like button state
  likeBtn.classList.toggle("liked", track.liked);

  audio.play();
  setPauseIcon();
}

/* Play / pause */
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    setPauseIcon();
  } else {
    audio.pause();
    setPlayIcon();
  }
}

/* SVG icon swap */
function setPlayIcon() {
  playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  playIcon.setAttribute("fill", "black");
}

function setPauseIcon() {
  playIcon.innerHTML = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
  playIcon.setAttribute("fill", "black");
}

/* Next / previous */
function nextTrack() {
  if (isShuffle) {
    let next = Math.floor(Math.random() * playlist.length);
    if (next === currentIndex && playlist.length > 1) {
      next = (next + 1) % playlist.length;
    }
    loadTrack(next);
  } else {
    const next = (currentIndex + 1) % playlist.length;
    loadTrack(next);
  }
}

function prevTrack() {
  const prev = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(prev);
}

/* Shuffle toggle */
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

/* Progress + times */
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

/* Seek */
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

/* Auto-next on end */
audio.addEventListener("ended", () => {
  nextTrack();
});

/* Keep icon synced */
audio.addEventListener("play", setPauseIcon);
audio.addEventListener("pause", setPlayIcon);

/* Like (Liked Songs) */
likeBtn.addEventListener("click", () => {
  const track = playlist[currentIndex];
  track.liked = !track.liked;
  likeBtn.classList.toggle("liked", track.liked);
});

/* Add to Playlist */
addBtn.addEventListener("click", () => {
  const track = playlist[currentIndex];
  alert(`Added "${track.title}" to your playlist (demo).`);
});

/* Share current song */
shareBtn.addEventListener("click", () => {
  const track = playlist[currentIndex];
  const shareText = `I'm listening to "${track.title}" by ${track.artist}! 🎧`;

  if (navigator.share) {
    navigator.share({
      title: track.title,
      text: shareText,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard
      .writeText(`${shareText} ${window.location.href}`)
      .then(() => alert("Share link copied!"));
  }
});

/* Helpers */
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* Initial */
loadTrack(0);
