
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

// function render {

// }

window.addEventListener('load', async () => {
    const topStories = await getTopStories();
    console.log(topStories);

    const mostPopular = await getMostPopular();
    console.log(mostPopular);

    // render();
});