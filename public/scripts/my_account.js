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
    console.log(account_info);
    const { name, email, password, interests, charities } = account_info;

    document.getElementById('name').innerText = name ? name : "no name";
    document.getElementById('email').innerText = email;
    document.getElementById('password').innerText = password;
    document.getElementById('interests').innerText = interests.length > 0 ? interests : "no interests :(";
}

window.addEventListener('load', async () => {
    await render();
});