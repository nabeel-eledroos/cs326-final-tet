const __dirname = location.protocol + '//' + location.host;

async function sign_in() {
    const username = document.getElementById('uname').value,
        password = document.getElementById('pword').value;
    body = {id: username, password: password};
    const response = await fetch(__dirname + '/signin', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        // const resjson = await response.json();
        window.location.href = '/app/app.html';
    } else {
        console.log(response.error);
        return;
    }
}

async function sign_up() {
    const name = document.getElementById('fullname').value.split(" "),
        first_name = name[0],
        last_name = name[1],
        email = document.getElementById('email').value,
        password = document.getElementById('password').value,
        repassword = document.getElementById('repassword').value;
    if (password != repassword) {
        console.log("Passwords Don't Match!");
        return;
    }
    body = {first_name: first_name, last_name: last_name, id: email, password: password};
    const response = await fetch(__dirname + '/signup', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        // const resjson = await response.json();
        window.location.href = '/signup/pick_interests.html';
    } else {
        console.log(response.error);
        return;
    }
}