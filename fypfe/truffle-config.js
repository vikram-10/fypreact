const path = require("path");

/*module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    }
  }
};*/
module.exports = {
  contracts_build_directory: "./client/src",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      protocol: "https",
      network_id: "*", // Match any network id
    },
  },
};
