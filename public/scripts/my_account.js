const __dirname = location.protocol + '//' + location.host;

async function getInfo() {
    try {
        const response = await fetch(__dirname + '/userInfo');
        console.log("trying");
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

window.addEventListener('load', async () => {
    const account_info = await getInfo();
    const { name, email, password, interests, charities } = account_info[0];

    document.getElementById('name').innerText = name ? name : "no name :(";
    document.getElementById('email').innerText = email;
    document.getElementById('password').innerText = password;
    document.getElementById('interests').innerText = interests.length > 0 ? interests : "no interests :(";
    console.log(account_info);
});

async function deleteAcct() {
    const response = await fetch(__dirname + '/closeAccount');

    if (response.ok) {
        const reshtml = await response.text();
        window.location.replace(reshtml);
    } else {
        console.log(response.error);
        return;
    }
}