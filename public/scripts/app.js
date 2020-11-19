
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

async function getCharities() {
    try {
        const response = await fetch(__dirname + '/charities');

        if(response.ok) {
            const charitiesJSON = await response.json();
            return charitiesJSON;
        } else {
            throw 'Problem fetching from the server: ' + response.statusText;
        }
    } catch(e) {
        alert(e);
        return { mostPopularResults: [] };
    }
}

async function searchCharities(param) {
    try {

        const body = { param:param };
        const response = await fetch(__dirname + '/charitySearch', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            const charitiesJSON = await response.json();
            return charitiesJSON;
        } else {
            throw 'Problem fetching from the server: ' + response.statusText;
        }
    } catch(e) {
        alert(e);
        return { mostPopularResults: [] };
    }
}


async function render(articles) {
    // Picking top 3 articles from result (how else should we pick articles?)
    for (let i=1;i<=3;i++) {
        document.getElementById(`card-${i}-title`).innerHTML = `<a href='${articles[i].url}' target='_blank'>${articles[i].title} </a> <i class='fas fa-${icons[articles[i].section]}'></i>`;
        document.getElementById(`card-${i}-text`).innerText = articles[i].section;

        // Searching for charities by article section
        console.log(articles[i].section);
        //TODO: edge case if search comes back empty
        const charities = await searchCharities(articles[i].section);
        console.log(charities);
        for (let j=1;j<=3;j++) {
            document.getElementById(`card-${i}-charity-${j}`).innerHTML = `<a href='${charities[j].charityNavigatorURL}' target='_blank'>${charities[j].charityName} </a>`;
        }
    }
}

window.addEventListener('load', async () => {
    // const topStories = await getTopStories();
    // console.log(topStories);

    const mostPopular = await getMostPopular();
    // console.log(mostPopular);
    await render(mostPopular.results);
});