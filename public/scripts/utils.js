async function sign_in() {
    const username = document.getElementById('uname').value;
    const password = document.getElementById('pword').value;
    body = {id: username, password: password};
    console.log(body);
    const response = await fetch('http://localhost:8080/signin', {
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

function sign_up() {
    console.log("hello");
}