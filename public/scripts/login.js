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

    console.log(response.ok);
    if (response.ok) {
        const reshtml = await response.text();
        window.location.href = reshtml;
    } else {
        console.log(response.error);
        return;
    }
}

function getInterests() {
    const formInputs = document.forms['signup-form'].getElementsByTagName('form-check-input');
    const interests = Array.from(formInputs).reduce((acc, box) => {
            if(box.checked) {
                acc.push(box.labels[0].innerText);
            }
            return acc;
        }, []);
    console.log(interests);
    return interests;
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
    
    const interests = getInterests();
    body = {
        first_name: first_name, 
        last_name: last_name, 
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
        window.location = resHTML;
    } else {
        console.log(response.error);
        return;
    }
}