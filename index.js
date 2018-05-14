const newsKey = "&apiKey=d5a8be0f6d7e4726a2f58ffd8cf2ab1a";
const newsURL = "https://newsapi.org/v2/";
const enterKeyCode = 13;

onStart();

function onStart() {
    fetchAllTopNews();
    document.getElementById("search-terms").addEventListener("click", searchWiden);
    document.getElementById("search-button").addEventListener("click", onSearchClick);
    document.getElementById("brand").addEventListener("click", onBrandClick);
    document.getElementById("search-terms").addEventListener("blur", collapseSearchbar);
    document.getElementById("search-terms-small").addEventListener("blur", collapseSmallSearchbar);
}

function checkKeypress(e) {
    // Sends search on enter as well as click
    if(e.keyCode == enterKeyCode) {
        onSearchClick();
        return false;
    }
}

function checkKeypressSmall(e) {
    // Sends search on enter as well as click
    if(e.keyCode == enterKeyCode) {
        onSearchClickSmall();
        return false;
    }
}

function onSearchClick() {
    let terms = document.getElementById("search-terms").value;
    fetchUserSearch(terms);
}

function onSearchClickSmall() {
    let searchTermsElement = document.getElementById("search-terms-small");
    let terms = searchTermsElement.value;
    document.getElementById("search-button-small").onclick = activateSmallSearch;
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
    document.getElementById("search-title").innerHTML = CONFIG.homepageTitle;
    fetch(newsURL + "everything?q=" + terms + newsKey)
        .then(r => {
            return r.json();
        })
        .then(data => {
            let results = data.articles;
            displayCards(results);
        })
        .catch(e => {
            console.log("An error occured: ${e}");
        });
}

function displayCards(newsList) {
    let articleContainer = document.getElementById("article-container");
    articleContainer.innerHTML = "";

    if(newsList === undefined) {
        articleContainer.innerHTML = CONFIG.searchError;
    }

    newsList.map(news => {
        let cardHTML =
            `<div class="small-12 medium-6 large-4">
                <a href="${news.url}"><div class="card">
                    <div class="card-section">
                        <div class="card-image"><img class="float-center" src="${news.urlToImage || 'no-image.jpg'}" onerror=imgError(this)></div>
                        <h5>${news.title}</h5>
                        <h6>${news.source.name}</h6>
                        <p>${news.description || ""}</p>
                    </div>
                </div></a>
            </div>`;
        articleContainer.innerHTML += cardHTML;
    });

    let matchMedia = window.matchMedia("(max-width: 700px)");
    if(!matchMedia.matches) {
        setTimeout(equalizeCards, CONFIG.shortTimeout);
    }
}

function equalizeCards() {
    let cardSection = Array.from(document.querySelectorAll(".card-section"));
    let heights = cardSection.map(card => card.clientHeight);
    let largest = Math.max.apply(Math, heights);
    cardSection.map(card => card.style.height = largest + "px");
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

function searchWiden() {
    if(!document.getElementById("search-terms").classList.contains("widen-search")){
        document.getElementById("search-terms").classList.add("widen-search");
    }
}

function activateSmallSearch() {
    if(!document.getElementById("search-terms-small").classList.contains("search-terms-expand")) {
        document.getElementById("search-terms-small").classList.add("search-terms-expand");
        document.getElementById("search-terms-small").focus();
        document.getElementById("search-button-small").onclick = onSearchClickSmall;
        console.log(document.getElementById("search-button-small").onclick);
    }
}

function collapseSearchbar() {
    let searchTerms = document.getElementById("search-terms");
    if(searchTerms.classList.contains("widen-search")) {
        searchTerms.classList.add("collapse-search");
        searchTerms.classList.remove("widen-search");
        setTimeout(function(){searchTerms.classList.remove("collapse-search")}, CONFIG.longTimeout);
    }
}

function collapseSmallSearchbar() {
    let searchTerms = document.getElementById("search-terms-small");
    if(searchTerms.classList.contains("search-terms-expand")) {
        searchTerms.classList.add("search-terms-collapse");
        setTimeout(function(){
            searchTerms.classList.remove("search-terms-expand");
            searchTerms.classList.remove("search-terms-collapse");
        }, CONFIG.shortTimeout);
    }

    setTimeout(function(){document.getElementById("search-button-small").onclick = activateSmallSearch;}, CONFIG.shortTimeout);
}
