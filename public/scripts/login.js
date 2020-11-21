const __dirname = location.protocol + '//' + location.host;

async function sign_in() {
    const email = document.getElementById('email').value,
        password = document.getElementById('pword').value,
        body = {id: email, password: password};
    await fetch(__dirname + '/signin', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
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
    if (password !== repassword) {
        alert('Passwords do not match!');
        return;
    }

    const interests = getInterests(),
    body = {
        email: email,
        password: password,
        name: name,
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
        window.location.href = __dirname + '/signin';
    } else {
        alert(response.error);
        return;
    }
}