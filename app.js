// const fs = require("fs");
const axios = require("axios").default;

const keywords = ["in stock", "for sale", "disponible"];
const isForSale = (text) => {
  for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
    const keyword = keywords[keywordIndex];
    const regex = new RegExp(keyword, "i");
    const result = text.match(regex);
    if (result) return true;
    console.log(`keyword ${keyword} did not match`);
  }
  return false;
};

module.exports = {
  handleEvent: async (event, context) => {
    console.log("enter");
    // Validate event
    if (!event || !event.address || event.address.length < 10) {
      console.log("no event");
      throw new Error(
        "'address' parameter is required and should be a real address"
      );
    }

    const { address } = event;
    // Get Google response
    const resp = await axios.get(`https://www.google.com/search?q=${address}`);

    // Validate keywords
    const found = isForSale(resp.data);
    // Write html file for testing purposes
    // TODO: remove this
    // fs.writeFileSync("./test.html", resp.data);

    return found;
  },
};
