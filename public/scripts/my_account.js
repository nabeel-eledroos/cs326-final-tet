const __dirname = location.protocol + '//' + location.host;

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

async function render() {
    const account_info = await getInfo();
    const { name, email, interests } = (account_info) ? account_info : 
        { "name" : "", 
          "email": "",
          "interests": "no interests :("
        };

    document.getElementById('name').innerText = name;
    document.getElementById('email').innerText = email;
    document.getElementById('interests').innerText = interests;
}

window.addEventListener('load', async () => {
    await render();
});