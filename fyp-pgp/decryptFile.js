// decrypt.js
const openpgp = require('openpgp');
const fs = require('fs');
const privateKeyArmored = fs.readFileSync('./private.key');
(async () => {
  const privateKey = (await openpgp.key.readArmored([privateKeyArmored]))
    .keys[0];
  const encryptedData = fs.readFileSync('encrypted-secret.txt');
  const decrypted = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedData),
    privateKeys: [privateKey]
  });
  fs.writeFile("out.png", decrypted.data, 'base64',function(err) {
  if(err)console.log(err);
  else console.log(`Image is Decrypted Successfully`);
});
})();
