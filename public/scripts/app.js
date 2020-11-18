
const __dirname = location.protocol + '//' + location.host;

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
        document.getElementById(`card-${i}-title`).innerHTML = "<a href='" + articles[i].url + "' target='_blank'>" + articles[i].title + "</a>";
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