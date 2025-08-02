const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");
const { readMemory, writeMemory } = require("../utils/fileHandler");

const upload = multer({ dest: "uploads/" });

router.get("/memory/:topic", async (req, res) => {
  const topic = req.params.topic;
  try {
    const content = await readMemory(topic);
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: "Błąd podczas odczytu pamięci" });
  }
});

router.post("/memory/:topic", async (req, res) => {
  const topic = req.params.topic;
  const { newText } = req.body;
  try {
    await writeMemory(topic, newText);
    res.json({ message: "Zapisano pomyślnie" });
  } catch (err) {
    res.status(500).json({ error: "Błąd podczas zapisu pamięci" });
  }
});

router.post("/upload-gdrive", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Brak pliku" });

    const creds = require("../client_secret.json").installed;
    const oAuth2Client = new google.auth.OAuth2(
      creds.client_id,
      creds.client_secret,
      creds.redirect_uris[0]
    );

    const token = require("../token.json");
    oAuth2Client.setCredentials(token);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const folderName = "Dane-Memory AI mini";
    const folderRes = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    let folderId = folderRes.data.files[0]?.id;
    if (!folderId) {
      const newFolder = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      folderId = newFolder.data.id;
    }

    const fileMetadata = {
      name: req.file.originalname,
      parents: [folderId],
    };
    const media = {
      body: fs.createReadStream(req.file.path),
    };

    const driveRes = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    await fs.promises.unlink(req.file.path);

    res.json({
      message: "Plik przesłano na Google Drive",
      fileId: driveRes.data.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd uploadu do Google Drive" });
  }
});

module.exports = router;