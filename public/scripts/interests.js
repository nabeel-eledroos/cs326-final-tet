const __dirname = location.protocol + '//' + location.host;

window.addEventListener('load', () => {
    document.getElementById('interests-submit').addEventListener('click', async () => {
        const formInputs = document.forms['interests-form'].getElementsByTagName('input');
        const interests = Array.from(formInputs).reduce((acc, box) => {
            if(box.checked) {
                acc.push(box.labels[0].innerText);
            }
            return acc;
        }, []);
        console.log(interests);

        const body = { interests: interests };
        const response = await fetch(__dirname + '/interests', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            const status = await response.json();
            console.log(status);
            window.location.href = '/app/app.html';
        } else {
            console.log(response.error);
            alert('Could not reach out to the server! Sorry.');
        }
    });
});