const __dirname = location.protocol + '//' + location.host;

async function sign_in() {
    const email = document.getElementById('email').value,
        password = document.getElementById('pword').value;
    body = {id: email, password: password};
    const response = await fetch(__dirname + '/signin', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const reshtml = await response.text();
        window.location.replace(reshtml);
    } else {
        console.log(response.error);
        return;
    }
}

function getInterests() {
    const formInputs = document.forms['signup-form'].getElementsByClassName('form-check-input');
    const interests = Array.from(formInputs).reduce((acc, box) => {
            if(box.checked) {
                acc.push(box.labels[0].innerText);
            }
            return acc;
        }, []);
    return interests;
}

async function sign_up() {
    const name = document.getElementById('fullname').value,
        email = document.getElementById('email').value,
        password = document.getElementById('password').value,
        repassword = document.getElementById('repassword').value;
    if (password != repassword) {
        //TODO: add pop-up for password mismatch
        console.log("Passwords Don't Match!");
        return;
    }

    const interests = getInterests();
    body = {
        name: name,
        id: email,
        password: password,
        interests: interests,
        charities: []
    };
    const response = await fetch(__dirname + '/signup', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const resHTML = await response.text();
        window.location.replace(resHTML);
    } else {
        console.log(response.error);
        return;
    }
}