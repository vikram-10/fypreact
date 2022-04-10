const openpgp = require("openpgp");
const fs = require("fs");

generate();
async function generate() {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    userIds: [{ name: "guru", accId : "0x3b7b9cA88a812e296cB7f8D12B5ea801BEfd0551"}],
    curve: "ed25519",
  });
  fs.writeFileSync("./private.key", privateKeyArmored);
  fs.writeFileSync("./public.key", publicKeyArmored);
  console.log(`Key Generation Successful`);
}
