const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

function readMemory(topic) {
  const filePath = path.join(dataDir, topic + ".txt");
  return fs.promises.readFile(filePath, "utf-8").catch(() => "");
}

function writeMemory(topic, newText) {
  const filePath = path.join(dataDir, topic + ".txt");
  const entry = `
[${new Date().toISOString()}]
${newText}
`;
  return fs.promises.appendFile(filePath, entry, "utf-8");
}

module.exports = { readMemory, writeMemory };