# 🧠 Memory AI – Google Drive Upload

Serwer Express.js do przechowywania notatek i przesyłania plików z GPTs do Google Drive.

## Endpointy

- `POST /memory/:topic` – dopisuje notatkę.
- `GET /memory/:topic` – odczytuje temat
- `POST /upload-gdrive` – przesyła plik do folderu "Dane-Memory AI mini" na Google Drive

## Wdrożenie na Render

1. Wgraj repozytorium na GitHub.
2. Utwórz usługę Web Service na Render.com.
3. Dodaj `client_secret.json` i `token.json` jako **Secret Files**.
4. Gotowe!

Pełna dokumentacja znajduje się w kodzie.
