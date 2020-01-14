const path = require('path');
const express = require('express');
const Csryptr = require('cryptr');
const cryptr = new Csryptr(String.toString(process.env.SECRET_KEY));
const bodyParser = require('body-parser');

const session = require('./lib/session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/createBookmark', (req, res, next) => {
  let msg;
  if (req.query.code == 400) {
    msg = 'Dein Link ist abgelaufen, bitte erstelle einen neuen!';
  } else if (req.query.code == 401) {
    msg =
      'Dein Link ist nicht gültig. Versuche es nocheinmal oder erstelle einen Neuen!';
  } else {
    msg = '';
  }
  res.render('createBookmark', { msg: msg });
});

app.get('/impressum', (req, res, next) => {
  res.render('impressum');
});

app.post('/createBookmark', (req, res, next) => {
  const plusDays = 100;
  const expireDate = new Date().setDate(new Date().getDate() + plusDays);
  const data = {
    name: req.body.name,
    pw: req.body.pw,
    expireDate: expireDate
  };

  const date = new Date();
  date.setDate(date.getDate() + plusDays);
  const dateString =
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear();

  const dataHashed = cryptr.encrypt(JSON.stringify(data));
  res.render('copylink', {
    link: 'http://' + req.get('host') + '/bookmark/' + dataHashed,
    expireDate: dateString
  });
});

app.use('/bookmark/:hash', (req, res, next) => {
  try {
    const dataDecString = cryptr.decrypt(req.params.hash);
    const dataDec = JSON.parse(dataDecString);
    if (dataDec.expireDate < Date.now()) {
      res.redirect('/createBookmark?code=400');
    } else {
      res.render('temp', {
        name: dataDec.name,
        pw: dataDec.pw
      });
    }
  } catch {
    res.redirect('/createBookmark?code=401');
  }
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use((req, res, next) => {
  res.render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listen to port ${PORT}`);
});
