document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const searchResultsList = document.getElementById('search-results');

    // Function to parse URL parameters
    function getUrlParams(url) {
        const params = {};
        const urlSearchParams = new URLSearchParams(url.split('?')[1]);
        for (const param of urlSearchParams) {
            params[param[0]] = param[1];
        }
        return params;
    }

    // Function to perform search and display results
    function performSearch(query) {
        const apiUrl = `https://antara.deno.dev/search?q=${query}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const searchResults = data.result;
                searchResultsList.innerHTML = ""; // Clear previous results

                searchResults.forEach(result => {
                    const listItem = document.createElement("div");
                    const thumbnail = document.createElement("img");
                    thumbnail.src = result.thumbnail;
                    listItem.appendChild(thumbnail);

                    const title = document.createElement("span");
                    title.textContent = sanitizeText(result.title);
                    listItem.appendChild(title);

                    const author = document.createElement("span");
                    author.textContent = sanitizeText(result.author);
                    listItem.appendChild(author);

                    // Add onclick event listener to each search result item
                  listItem.addEventListener('click', function() {
                      const audioId = result.videoId;
                      const title = encodeURIComponent(result.title);
                      const author = encodeURIComponent(result.author);
                      window.location.href = `../play?title=${title}&author=${author}&audioId=${audioId}`;
                  });

                    searchResultsList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
            });
    }

    // Function to sanitize text and replace special characters with HTML entities
    function sanitizeText(text) {
        return text.replace(/\n/g, '<br>').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Get search query from URL and perform search
    const urlParams = getUrlParams(window.location.href);
    const searchQuery = urlParams.q;
    if (searchQuery) {
        searchInput.value = searchQuery;
        performSearch(searchQuery);
    } else {
        console.error("No search query provided in URL.");
    }

    // Event listener for input field
    searchInput.addEventListener('keydown', function(event) {
        if (event.keyCode === 13 || event.keyCode === 10) { // Enter key code or newline key code
            const query = searchInput.value;
            performSearch(query);
        }
    });
});