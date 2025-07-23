const express = require("express");
const sqlite3 = require("sqlite3");
const { logger } = require("./middlewares/logger.js");

const PORT = 32400;

const { generateShortcode } = require("./extras/shortener.js");

const app = express();

const db = new sqlite3.Database('./database/urls.db', (err) => {
    if (err) return console.log(err.message);
    console.log("Connected to the SQLite3 Database.");
});


db.run(`
    CREATE TABLE IF NOT EXISTS url(
        ID INTEGER PRIMARY KEY,
        LONG_URL TEXT NOT NULL,
        SHORT_URL TEXT,
        EXPIRY TEXT DEFAULT (datetime('now', '+30 minutes'))
    )
`);

app.use(express.json());


// Main Endpoint
app.post("/shorturls", logger, async (req, res) => {
    let { url, validity, shortcode } = req.body;
    if (!url) res.status(400).json({message: 'Bad Request'});
    if (!shortcode) shortcode = await generateShortcode(6);
    if (!validity) validity = 30;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + validity);


    db.run(
        `INSERT INTO url (LONG_URL, SHORT_URL) VALUES (?, ?)`,
        [url, shortcode],
        function (err)  {
            if(err) return res.status(500).json({ message: err.message });
        }
    );
    const new_url = `http://localhost:${PORT}/shorturls/${shortcode}`;
    res.status(201).json({ shortLink: new_url, expiry: expiry.toString() });

});

app.get("/shorturls/:shortcode", (req, res) => {
    const { shortcode } = req.params;
    db.get(
        "SELECT * FROM url WHERE SHORT_URL = ?",
        [shortcode],
        (err, row) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!row) return res.status(404).json({ message: "Shortcode not found" });
            res.json({ short_url: row.SHORT_URL, expiry: row.EXPIRY });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

