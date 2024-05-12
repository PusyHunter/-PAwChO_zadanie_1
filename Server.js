const http = require('http');
const { DateTime } = require('luxon');
const IP = require('ip');

// Dane autora serwera
const authorName = "Leanid Shaveika";

const server = http.createServer((req, res) => {
    
    // Pobieranie adresu IP klienta
    const ip = req.connection.remoteAddress;

    // Znajdowanie daty i czasu w strefie czasowej klienta
    const clientTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

    // Tworzenie odpowiedzi
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Tworzenie treści odpowiedzi
    const responseContent = `
        <html>
            <head>
                <title>Server</title>
            </head>
            <body>
                <h1>Info:</h1>
                <p>Adres IP klienta: ${ip}</p>
                <p>Data i godzina w strefie czasowej klienta: ${clientTime}</p>
            </body>
        </html>
    `;

    // Wysyłanie odpowiedzi
    res.write(responseContent);
    res.end();
});

// Pobieranie aktualnego czasu
const currentTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

// Wypisanie informacji do logów
console.log(`Serwer uruchomiony byl: ${currentTime}`);
console.log(`Imię Nazwisko autora serwera: ${authorName}`);


// Uruchomienie serwera na porcie 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie: ${PORT}`);
});
