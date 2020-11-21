
const __dirname = location.protocol + '//' + location.host;

const icons = { "Arts": "palette", "Automobiles": "car", "Books": "book", 'Business': "user-tie", "Fashion": "tshirt", "Style":"tshirt", "Food": "hamburger",
    "Health": "heartbeat", "Home": "star", "Insider": "user-secret", "Magazine": "newspaper", "Movies": "video", "New York": "map-pin", "Obituaries": "skull-crossbones",
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


async function render_trending(articles) {
    // Picking a random number (1-17) and getting 3 articles
    const article_start = Math.floor(Math.random() * 17) + 1;
    let card_num = 1;
    // console.log(articles);

    for (let i=article_start;i<article_start+3;i++) {
        document.getElementById(`card-${card_num}-title`).innerHTML = `<a href='${articles[i].url}' target='_blank'>${articles[i].title} </a> <i class='fas fa-${icons[articles[i].section]}'></i>`;
        document.getElementById(`card-${card_num}-text`).innerText = articles[i].section;

        // Searching for charities by article section
        //TODO: edge case if search comes back empty
        const charities = await searchCharities(articles[i].section);
        // console.log(charities);
        // Picking a random number (1-17) and getting 3 charities
        const charity_start = Math.floor(Math.random() * 17) + 1;
        let charity_num = 1;
        for (let j=charity_start;j<charity_start+3;j++) {
            document.getElementById(`card-${card_num}-charity-${charity_num}`).innerHTML = `<a href='${charities[j].charityNavigatorURL}' target='_blank'>${charities[j].charityName} </a>`;
            if (charities[j].irsClassification.nteeClassification) {
                document.getElementById(`card-${card_num}-charity-${charity_num}-info`).innerText = `Type: ${charities[j].irsClassification.nteeClassification}`;
            } else {
                document.getElementById(`card-${card_num}-charity-${charity_num}-info`).innerText = "No info available";
            }
            charity_num ++;
        }
        card_num ++;
    }
}

async function render_causes(filter) {
    const charities = await searchCharities(filter);

    // Rendering a max of 8 charities
    const max = (charities.length>8) ? 8 : charities.length;
    const parent = document.getElementById('cause-wrapper');
    for (let j=0;j<max;j++) {
        const cause = document.createElement('div');
        cause.classList.add('cause');
        cause.innerHTML = `<a href='${charities[j].charityNavigatorURL}' class='text' target='_blank'>${charities[j].charityName} </a>`;

        parent.appendChild(cause);
    }
}

async function getInfo() {
    try {
        const response = await fetch(__dirname + '/userInfo');
        if(response.ok) {
            const accountInfo = await response.json();
            return accountInfo;
        } else {
            throw 'Problem fetching from server: ' + response.statusText;
        }
    } catch(e) {
        alert(e);
        return { empty_acc: [] };
    }
}

async function render_filters() {
    const account_info = await getInfo();
    const { interests } = account_info[0];
    if (interests.length === 0) {
        interests = ["coronavirus", "environment", "education"];
    }
    const parent = document.getElementById('cause-filter');
    interests.forEach((interest) => {
        let option = document.createElement("option");
        option.text = interest;
        option.value = interest;
        parent.add(option);
    });
}

window.addEventListener('load', async () => {
    const mostPopular = await getMostPopular();
    await render_trending(mostPopular.results);

    await render_filters();
});

document.getElementById('cause-filter').addEventListener('change', async (event) => {
    document.getElementById('cause-wrapper').innerHTML = '';
    await render_causes(event.target.value);
});