console.log("lets write javaScript")
// Global Veriable
let currentSong = new Audio();
let songs;
let currentFolder;

// function is convert the seconds::minites(Using GPT)

function secondsToMinutesAndSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input"
    }
    const minites = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minites).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`
}


async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`${folder}/`) // fetch API Add: http://127.0.0.1:5500/songs/
    let responce = await a.text()
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    songs = []; /*songName empty array*/

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]) /* for Ex: [hi im swarup] split is 2types of given splitUsing "im" ---> hi , swarup*/
        }

    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""; //empty ullist
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
            <li> 
                <img class="invert" src="music.svg" alt="" srcset="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                            <div>Swarup</div>
                        </div>
                        <div class="playnow">
                            <span>playnow</span>
                            <img class="invert" src="playlist.svg" alt="" srcset="">
                    </div> 
            </li>`;
    }
    // Attached all event listner to each song:
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {  /*for playtime song play & pause*/
    currentSong.src = `${currentFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";   /*play time showsing [pause] symbol*/
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let responce = await a.text()
    let div = document.createElement("div")
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardContainer")
    Array.from(anchors).forEach( async e => {
        // console.log(e.href)
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let responce = await a.json();
            console.log(responce)
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50">
                        <!-- Circular background -->
                        <rect width="100%" height="100%" rx="55%" fill="#00FF00" />

                        <!-- Original SVG path -->
                        <svg x="13" y="13" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="" srcset="">
                <h2${responce.title}</h2>
                <p>${responce.discription}</p>
            </div>
            `
        }
    })

    // console.log("anchor")
}
async function main() {

    // all the song list
    songs = await getSongs("songs/NoCpySongs")
    playMusic(songs[0], true)

    //cut and put on getSong file inside[Noted] for Acess to Card Click 
    // Display All the album on the page
    displayAlbums()

    // Attach addeventListner to play and next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    // timeUpdate listen even showing function
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`

        // seekbar circle running
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // For seekbar responce Add EventListner 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentDuration = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // divided into duration
        document.querySelector(".circle").style.left = percentDuration + "%";
        currentSong.currentTime = ((currentSong.duration) * percentDuration) / 100;
    })

    //Add EventListner for sidebar icon
    document.querySelector(".hemburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add EventListner for Close button
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    // Add EventListner use for previous
    previous.addEventListener("click", () => {
        console.log("Previous is working")
        console.log(currentSong)
        console.log(currentSong.src.split("/").slice(-1)[0])
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) > 0) {
            playMusic(songs[index - 1])

        }

    })

    // Add EventListner use for next
    next.addEventListener("click", () => {
        console.log(currentSong)
        console.log(currentSong.src.split("/").slice(-1)[0]) /*song link findOut [0 is index]*/
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) { /*for smoothly next songs*/
            playMusic(songs[index + 1])

        }
    })

    // Add to EventListner VolumeBar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;   /*parseInt is String space igone*/
    })

    //Load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) /*Load songs Folder*/
            playMusic(songs[0])

        })
    })
    // Add EventListner Mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        
        }
        else{
            e.target.src= e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}
main()
