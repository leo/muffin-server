exports.isAuthenticated = function(cookies) {

  const cookie = cookies.AuthSession;

  const nano = require('nano')({
    url: 'http://localhost:5984',
    cookie: 'AuthSession=' + cookie
  });

  return new Promise(function(resolve, reject) {

    if (!cookie) {
      reject('Cookie not existing');
    }

    nano.session(function(err, session) {

      if (err || !session.userCtx.name) {
        reject('No session running');
      }

      resolve('Session on');

    });

  });

}
