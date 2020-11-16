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
    const { name, email, password, interests, charities } = account_info[0];

    document.getElementById('name').innerText = name ? name : "no name";
    document.getElementById('email').innerText = email;
    document.getElementById('password').innerText = password;
    document.getElementById('interests').innerText = interests.length > 0 ? interests : "no interests :(";
}

window.addEventListener('load', async () => {
    render();
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

async function changePass() {
    body = { current_password: document.getElementById('cpass').value, new_password: document.getElementById('npass').value };
    const response = await fetch(__dirname + '/changePass', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const reshtml = await response.text();
        window.location.replace(reshtml);
        render();
    } else {
        console.log(response.error);
        return;
    }
}