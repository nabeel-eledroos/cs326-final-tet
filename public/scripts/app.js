
const __dirname = location.protocol + '//' + location.host;

const icons = { "Arts": "palette", "Automobiles": "car", "Books": "book", 'Business': "user-tie", "Fashion": "tshirt", "Food": "hamburger",
    "Health": "heartbeat", "Home": "star", "Insider": "user-secret", "Magazine": "newspaper", "Movies": "video", "Nyregion": "map-pin", "Obituaries": "skull-crossbones",
    "Opinion": "pen", "Politics": "landmark", "Realestate": "home", "Science": "virus", "Sports": "futbol", "Sundayreview": "question", "Technology": "tv",
    "Theater": "theater-masks", "T-magazine": "route", "Travel": "route", "Upshot": "question", "U.S.": "flag-usa", "World" : "globe-americas"
}

async function getTopStories() {
    try {
        const response = await fetch(__dirname + '/topStories');

        if(response.ok) {
            const topStoriesJSON = await response.json();
            return topStoriesJSON;
        } else {
            throw 'Problem fetching from server: ' + response.statusText;
        }
    } catch(e) {
        alert(e);
        return { topStoriesResults: [] };
    }
}

async function getMostPopular() {
    try {
        const response = await fetch(__dirname + '/mostPopular');

        if(response.ok) {
            const mostPopularJSON = await response.json();
            return mostPopularJSON;
        } else {
            throw 'Problem fetching most popular stories from the server: ' + response.statusText;
        }
    } catch(e) {
        alert(e);
        return { mostPopularResults: [] };
    }
}


function render(articles) {
    // Picking top 3 articles from result (how else should we pick articles?)
    for (let i=1;i<=3;i++) {
        document.getElementById(`card-${i}-title`).innerHTML = "<a href='" + articles[i].url + "' target='_blank'>" + articles[i].title + " </a> <i class='fas fa-" + icons[articles[i].section] + "'></i>";
        document.getElementById(`card-${i}-text`).innerText = articles[i].section;
    }
}

window.addEventListener('load', async () => {
    // const topStories = await getTopStories();
    // console.log(topStories);

    const mostPopular = await getMostPopular();
    console.log(mostPopular);
    render(mostPopular.results);
});