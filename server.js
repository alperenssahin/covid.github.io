const express = require('express');
const app = express();
const port = 3000;
app.use(express.static("public"));
app.get('/', (req, res) => res.sendFile('/Users/alperensahin/Desktop/covid-war/index.html'));
// app.get('/js/form.js', (req, res) => res.sendFile('/Users/alperensahin/Desktop/covid-war/js/form.js'));
// app.get('/css/style.js', (req, res) => res.sendFile('/Users/alperensahin/Desktop/covid-war/css/style.js'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));