export async function add(req, res) {
    const v = ["hector@gmail.com", "asdas", "asdsAA", "dave", ["charity", "animals"], [1, 3, 4]];
    await connectAndRun(db => db.none(
        "INSERT INTO users(email, salt, password, name, interests, charities) VALUES ($1, $2, $3, $4, $5, $6);",
        v));
        res.end();
    }