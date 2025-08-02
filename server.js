const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Utwórz katalog "data", jeśli nie istnieje
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

app.use("/", require("./routes/memoryRoutes"));

// Serwowanie manifestu i openapi.yaml
app.get("/.well-known/ai-plugin.json", (req, res) => {
    res.sendFile(path.join(__dirname, ".well-known", "ai-plugin.json"));
});

app.get("/openapi.yaml", (req, res) => {
    res.sendFile(path.join(__dirname, "openapi.yaml"));
});

app.get("/status", (req, res) => {
    res.json({ status: "Działa!" });
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});