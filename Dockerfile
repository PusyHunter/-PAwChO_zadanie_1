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
