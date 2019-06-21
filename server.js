const express = require('express');
const router = express.Router();
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const API_KEY = 'AIzaSyALb4eynR_OL39AuK731m6pB1toiTAP0Xg';
// const API_KEY = 'AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s';
// const API_KEY = 'AIzaSyA5l6I42KwsLL1W_rAHxjTMPdpVDDdy9RE';

const app = express();
app.use(express.json());
app.use('/', router);
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on PORT ${port}`));

router.get('/getcurradd', (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;
  // fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}
  //   &location_type=ROOFTOP&result_type=street_address&key=${API_KEY}`)
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});

router.get('/getlocation', (req, res) => {
  const search = req.query.search;
  fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${search}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

router.get('/placesearch', (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;
  const category = req.query.cat;
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=${category}&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});

router.get('/search', (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&rankby=distance&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});

router.get('/getdistance', (req, res) => {
  const origin = req.query.origin;
  const dest = req.query.dest;
  fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${dest}&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});

router.get('/getnextpage', (req, res) => {
  const nextToken = req.query.nextToken;
  const lat = req.query.lat;
  const long = req.query.long;
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/place/textsearch/json?query=location=${lat},${long}&pagetoken=${nextToken}&radius=10000&key=${API_KEY}`
  //   )
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextToken}&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});

router.get('/placedetail', (req, res) => {
  const place = req.query.id;
  fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place}&fields=name,rating,international_phone_number,website,formatted_address&key=${API_KEY}`
  )
    .then(res => res.json())
    .then(data => res.send(data));
});
