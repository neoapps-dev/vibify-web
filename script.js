document.addEventListener("DOMContentLoaded", function() {
    const songsList = document.getElementById("songs-list");
    const loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("loading-spinner");
    songsList.appendChild(loadingSpinner);

    function showLoadingSpinner() {
        loadingSpinner.style.display = "block";
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = "none";
    }

    function showError(message) {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = message;
        songsList.appendChild(errorMessage);
    }

    function getCountryCode() {
        return new Promise((resolve, reject) => {
            fetch("https://ipapi.co/json/")
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.country;
                    resolve(countryCode);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    showLoadingSpinner();

    getCountryCode()
        .then(countryCode => {
            const url = `https://antara.deno.dev/home?gl=${countryCode}`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    hideLoadingSpinner();
                    const quickPicks = data.results.quick_picks;
                    songsList.innerHTML = ""; // Clear previous content

                    quickPicks.forEach(song => {
                        const listItem = document.createElement("li");
                        listItem.classList.add("song-item");

                        const thumbnail = document.createElement("img");
                        thumbnail.classList.add("thumbnail");
                        thumbnail.src = song.thumbnail;
                        listItem.appendChild(thumbnail);

                        const songDetails = document.createElement("div");
                        songDetails.classList.add("song-details");

                        const title = document.createElement("span");
                        title.textContent = song.title;
                        songDetails.appendChild(title);

                        const artist = document.createElement("span");
                        artist.textContent = song.author;
                        songDetails.appendChild(artist);

                        listItem.appendChild(songDetails);
                        songsList.appendChild(listItem);

                        // Add event listener for each song item
                        listItem.addEventListener('click', function() {
                            const audioId = song.videoId; // Assuming videoId is equivalent to audioId
                            window.location.href = `play?audioId=${audioId}&title=${encodeURIComponent(song.title)}&author=${encodeURIComponent(song.author)}`;
                        });
                    });
                })
                .catch(error => {
                    hideLoadingSpinner();
                    console.error("Error fetching data:", error);
                    showError("Failed to fetch data. Please try again later.");
                });
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error("Error getting country code:", error);
            showError("Failed to get country code. Please try again later.");
        });
});
