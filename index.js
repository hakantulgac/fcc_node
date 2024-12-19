require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const urlParse = require("url");
const dns = require("dns");

const client = new MongoClient(process.env.DB_URL);
const db = client.db("test");
const urls = db.collection("people");

const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const _url = req.body.url;
  const url = urlParse.parse(_url).hostname;

  dns.lookup(url, async (err, adress)=>{
    if(adress && !err && _url.includes("https")){
      const shortUrl = await urls.countDocuments({});
      
      urls.insertOne({
        original_url : _url,
        short_url : shortUrl
      })

      res.json({ original_url:_url,short_url:shortUrl });
    }else{
      res.json({ error: 'Invalid URL' });
    }
  });
});

app.get('/api/shorturl/:short_url', async function(req, res) {
  const short_url = Number(req.params.short_url);
  const urlDoc = await urls.findOne({short_url});
  res.redirect(urlDoc.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
