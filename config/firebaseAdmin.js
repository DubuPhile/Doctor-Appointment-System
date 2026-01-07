const admin = require('firebase-admin');

const serviceAccountPath =
  process.env.NODE_ENV === 'production'
    ? '/etc/secrets/FBserviceAccountKey.json'
    : '../FBserviceAccountKey.json';

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;