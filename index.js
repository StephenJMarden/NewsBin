const newsKey = "&apiKey=d5a8be0f6d7e4726a2f58ffd8cf2ab1a";
const newsURL = "https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/";

onStart();

function onStart() {
    fetchAllTopNews();
    document.getElementById("search-button").addEventListener("click", onSearchClick);
    document.getElementById("brand").addEventListener("click", onBrandClick);
}

function checkKeypress(e) {
    if(e.keyCode == 13) {
        onSearchClick();
        return false;
    }
}

function onSmallSearch() {

}

function onSearchClick() {
    let terms = document.getElementById("search-terms").value;
    fetchUserSearch(terms);
}

function onBrandClick() {
    fetchAllTopNews();
}

function fetchAllTopNews() {
    document.getElementById("search-title").innerHTML = "Top Headlines";
    fetch(newsURL + "top-headlines?country=us" + newsKey)
        .then(r => {
            return r.json();
        })
        .then(data => {
            let results = data.articles;
            console.log(results);
            displayCards(results);
        })
        .catch(e => {
            console.log("An error occured: ${e}");
        });
}

function fetchUserSearch(terms) {
    document.getElementById("search-title").innerHTML = "Search Results";
    fetch(newsURL + "everything?q=" + terms + newsKey)
        .then(r => {
            return r.json();
        })
        .then(data => {
            let results = data.articles;
            console.log(results);
            displayCards(results);
        })
        .catch(e => {
            console.log("An error occured: ${e}");
        });
}

function displayCards(newsList) {
    let articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = "";

    newsList.map(news => {
        let cardHTML =
            `<div class="small-12 medium-6 large-4">
                <a href="${news.url}"><div class="card">
                    <div class="card-section">
                        <div class="card-image"><img src="${news.urlToImage}" onerror=imgError(this)></div>
                        <h5>${news.title}</h5>
                        <h6>${news.source.name}</h6>
                        <p>${news.description}</p>
                    </div>
                </div></a>
            </div>`;
        articleContainer.innerHTML += cardHTML;
    });
}

function forceHTTPS(link) {
    if(link.substr(0, 4) !== "https") {
        let temp = link.substr(4);
        return "https" + temp;
    }

    return link;
}

function imgError(img) {
    img.onerror = "";
    img.src = "";
    img.style = "display: none";
}