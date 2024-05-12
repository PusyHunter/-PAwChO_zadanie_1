# -PAwChO_zadanie_1

//Server.js
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


//Dockerfile
# Etap 1: Budowanie aplikacji
FROM node:14 AS builder

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Skopiowanie plikow aplikacji do kontenera
COPY package.json package-lock.json ./

# Instaluj zależności aplikacji (osobno kopiujemy pliki package.json i package-lock.json, aby uniknąć ponownej instalacji, gdy tylko pliki aplikacji się nie zmienią)
RUN npm install

# Skopiuj resztę plików aplikacji
COPY . .

# Etap 2: Używamy lekkiego obrazu Node.js jako bazowy obraz
FROM node:14-slim

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Skopiowanie plikow aplikacji z poprzedniego etapu
COPY --from=builder /app .

# Instaluj tylko niezbędne moduły, aby zminimalizować rozmiar obrazu
RUN npm install --production

# Skonfiguruj zmienne środowiskowe
ENV PORT=3000

# Nasluchiwanie na porcie 3000
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:$PORT/ || exit 1

# Uruchomienie serwera
CMD ["node", "Server.js"]


//polecenia
docker build -t zadanie_1 .  //budowanie obrazu
docker run -p 3000:3000 zadanie_1  //uruchomienie kontenera
docker logs crazy_cannon     //sposob uzyskania informacji(logow), które wygenerował serwer w trakcie uruchamiana (punkt 1a) 
docker history zadanie_1     // sprawdzenie, ile warstw posiada zbudowany obraz 


//wrzucam obraz na DockerHub
docker login

docker tag zadanie_1 90shothatchfan/zadanie_1 

docker push 90shothatchfan/zadanie_1
