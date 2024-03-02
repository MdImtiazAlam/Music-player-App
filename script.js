
import { songs } from './SongsData.js';

// Ensure the path to the 'songsData.js' file is correct based on your project structure.
const img = document.querySelector("#img");
const playPause = document.querySelector("#playpause");
const playPauseBtn = document.querySelector("#playpause-btn");
const audio = document.querySelector("#audio");
const title = document.querySelector("#title");
const prevBtn = document.querySelector("#prevbtn");
const nextBtn = document.querySelector("#nextbtn");
const progress = document.querySelector("#progress");
const progressBar = document.querySelector(".progress-bar");
const currTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".duration-time");
const volume = document.querySelector("#volume");
const layer = document.querySelector(".layer");
const volBar = document.querySelector(".bar");
const progressLine = document.querySelector(".progress-line");
const volumeRange = document.querySelector(".volumerange");
const repeatBtn = document.querySelector("#repeat");
const likeBtn = document.querySelector("#like");
const likeIcon = document.querySelector("#likeicon");
const songListBtn = document.querySelector("#list");
const songList = document.querySelector("#songs-list");
const listCloseBtn = document.querySelector("#listclose");
// songs array

function musicList() {
  songList.appendChild(listCloseBtn);
  songList.classList.toggle("showlist");

  if (songList.classList.contains("showlist")) {
    const list = document.createElement("ul");
    songs.forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = `${song.displayName} (${index + 1})`;

      if (songIndex === index) {
        li.classList.add("active");
      }

      li.addEventListener("click", async () => {
        songIndex = index;
        await loadSong(songs[songIndex]);
        playSong();
        songList.classList.remove("showlist");
        updateLyrics(songs[songIndex]);

        // Remove active class from previously active song
        Array.from(document.querySelectorAll("#songs-list li.active")).forEach((item) => {
          item.classList.remove("active");
        });

        // Add active class to the newly selected song
        li.classList.add("active");
      });
      list.appendChild(li);
    });
    songList.innerHTML = "";
    songList.appendChild(list);
  } else {
    songList.innerHTML = "";
  }

  // Add event listener to listCloseBtn
  listCloseBtn.addEventListener("click", () => {
    songList.classList.remove("showlist");
  });
}
  // Add event listener to listCloseBtn
  
// deafult song index 
let songIndex = 2;

// song default state
let isPlaying = false;

// song pause function
function playSong(){
  isPlaying = true;
  playPauseBtn.classList.replace("fa-play","fa-pause");
  audio.play();
}

// song play function
function pauseSong(){
  isPlaying = false;
  playPauseBtn.classList.replace("fa-pause","fa-play");
  audio.pause();
}

// loading songs
function loadSong(song){
    img.src = song.cover;
    title.textContent = song.displayName;
    audio.src = song.path;
};

// previous song 
function prevSong(){
  songIndex--;
  if(songIndex < 0){
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// next song
function nextSong(){
  songIndex++;
  if(songIndex > songs.length-1){
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}


// progress bar function
console.log(audio.duration);

function updateProgress(e){
  if (isPlaying) {
    const { duration, currentTime } = e.target;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.value = progressPercent;
    progressLine.style.width = `${progressPercent}%`;
    if(progressPercent==100){
      return nextSong();
    }
    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      totalDuration.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currTime.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}



function progressSlide(e){
  const { value } = e.target;
  const progressTime = Math.ceil((audio.duration / 100) * value);
  audio.currentTime = progressTime;
  console.log(progressTime);
    if(!isPlaying) {
      progressLine.style.width = `${value}%`;    
   }
}

function volumeBar(){
  layer.classList.toggle('hide');
  setTimeout(()=>{
    if(layer.classList.contains("hide")){
      layer.classList.remove("hide");
    }
  }, 5000);
}

function setVolume(){
  audio.volume = volumeRange.value;
  const barWidth = (volumeRange.value/1)*100;
  volBar.style.width = `${barWidth}%`;
}

function repeat(){
  repeatBtn.classList.toggle('color');
  const repeatBtnState = repeatBtn.classList.contains("color");
  if(repeatBtnState){
    audio.loop = true;
    loadSong();
  }else{
    audio.loop = false;
    loadSong();
  }
  
}

function like() {
  if (likeBtn.classList.toggle('color')) {
    likeIcon.classList.replace('far', 'fas');
  } else {
    likeIcon.classList.replace('fas', 'far');
  }
}



playPause.addEventListener("click", () => (isPlaying ? pauseSong() : playSong())); 
prevBtn.addEventListener("click",prevSong);
nextBtn.addEventListener("click",nextSong);
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", progressSlide);
volume.addEventListener("click", volumeBar);
volumeRange.addEventListener("input",setVolume);
repeatBtn.addEventListener("click", repeat);
likeBtn.addEventListener("click", like);
songListBtn.addEventListener("click",musicList);