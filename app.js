const express = require('express');
const multer  = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("hiiii", req.body);
        const directory = path.join('uploads', req.body.subject, `${req.body.course}-Semester${req.body.sem}-${req.body.year}`, req.body.exam);
        fs.mkdirSync(directory, { recursive: true });
        cb(null, directory);
    },
    filename: function (req, file, cb) {
       cb(null, req.body.registration + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body);
    res.json({"msg" : "File uploaded successfully!"});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
