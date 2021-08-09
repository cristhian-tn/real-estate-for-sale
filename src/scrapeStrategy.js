const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keywords = require("./keywords.json");
const { logger } = require("./logger");

class ScrapeStrategy {
  isPropertyForSale(html) {
    logger.info("Scraping html using ScrapeStrategy");
    const dom = new JSDOM(html);
    const { window } = dom;
    const { document } = window;
    const titleQuery = "#main > div > div > div a > h3";
    const titleNodes = document.querySelectorAll(titleQuery);
    const mainNodes = Array.from(titleNodes).map(node => {
      const mainItemAncestor = node.parentNode.parentNode.parentNode;
      return mainItemAncestor;
    });
    const foundPricesNodes = Array.from(mainNodes).flatMap(main => {
      const spanList = main.querySelectorAll("span");
      const priceSpan = Array.from(spanList).find(s => {
        return window.getComputedStyle(s).getPropertyValue('color') === "rgb(112, 117, 122)" && (s.textContent.toLowerCase().indexOf("usd") >= 0 || s.textContent.indexOf("$") >= 0)
      })
      if (!priceSpan) {
        return [];
      }
      return [priceSpan]
    })

    const foundTags = foundPricesNodes.flatMap(priceNode => {
      // Google puts tags next to the price
      try {
        const nextSibling = priceNode.nextElementSibling;
        if (!nextSibling) {
          return []
        }
        return [nextSibling]

      } catch (error) {
        return []
      }
    });

    const isForSale = foundTags.some(tag => {
      return keywords.includes(tag.textContent.toLowerCase());
    })

    return isForSale;
  }
}

module.exports = ScrapeStrategy;