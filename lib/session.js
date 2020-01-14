const request = require('request').defaults({ jar: true });

const j = request.jar();

exports.getCookie = (name, pw, callback) => {
  request.post(
    'https://tuwel.tuwien.ac.at/my/',
    { form: { name: name, pw: pw } },
    (err, res, body) => {
      if (!err) {
        const cookie = res.headers['set-cookie'][0].split(';');
        console.log('breakpoint');
        return callback(null, cookie[0]);
      } else {
        return callback(
          'Etwas ist mit deinem Link schief gelaufen. Versuch es nochmal oder erstelle einen neuen Link!'
        );
      }
    }
  );
};

exports.getSite = () => {
  request.get(
    'https://tuwel.tuwien.ac.at/my/',
    {
      headers: {
        Cookie: ''
      }
    },
    (err, res, body) => {
      console.log(res.headers);
      console.log(res.headers['set-cookie']);
      console.log(j.getCookies('https://tuwel.tuwien.ac.at/my/'));
    }
  );
};
