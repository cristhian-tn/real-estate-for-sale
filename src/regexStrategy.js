const keywords = require("./keywords.json");
const { logger } = require("./logger");

class RegexStrategy {
  isPropertyForSale(html) {
    logger.info("Scraping html using RegexStrategy");
    for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
      const keyword = keywords[keywordIndex];
      const regex = new RegExp(keyword, "i");
      const result = html.match(regex);
      if (result) return true;
    }
    return false;
  }
}

module.exports = RegexStrategy;