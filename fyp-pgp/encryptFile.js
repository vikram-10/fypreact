// encrypt.js
const openpgp = require('openpgp');
const fs = require('fs');
const publicKeyArmored = fs.readFileSync('./public.key', {
  encoding: 'utf8',
  flag: 'r'
});
(async () => {
  const plainData = fs.readFileSync('picture.png');
  const imageData = new Buffer(plainData).toString('base64');
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(imageData),
    publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
  });
  fs.writeFileSync('encrypted-secret.txt', encrypted.data);
  console.log(`Image is Encrypted`);
})();