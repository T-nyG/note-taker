const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function (req, res) {
  const addNote = req.body;
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    parsedData.push(addNote);
    parsedData.forEach((note, index) => (note.id = index + 1));
    let newNote = JSON.stringify(parsedData);
    fs.writeFile("./db/db.json", newNote, (err) => {
      if (err) throw err;
    });
    res.json(parsedData);
  });
});

app.delete("/api/notes/:id", function (req, res) {
  const deleteNote = parseInt(req.params.id);
  const dbNotes = JSON.parse(fs.readFileSync("./db/db.json"));
  const stringifyNotes = JSON.stringify(
    dbNotes.filter((req) => req.id !== deleteNote)
  );
  fs.writeFile("./db/db.json", stringifyNotes, (err, data) => {
    if (err) throw err;
  });
  res.json(stringifyNotes);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
