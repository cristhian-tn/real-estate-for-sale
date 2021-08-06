// const fs = require("fs");
const axios = require("axios").default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const keywords = ["in stock", "for sale", "on sale", "for-sale", "disponible"];
const isForSale = (text) => {
  for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
    const keyword = keywords[keywordIndex];
    const regex = new RegExp(keyword, "i");
    const result = text.match(regex);
    if (result) return true;
  }
  return false;
};

const isForSale5 = (html) => {
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

module.exports = {
  handleEvent: async (event, context) => {
    // Validate event
    if (!event || !event.address || event.address.length < 10) {
      throw new Error(
        "'address' parameter is required and should be a real address"
      );
    }

    const { address } = event;
    // Get Google response
    const resp = await axios.get(`https://www.google.com/search?q=${address}`);

    // Validate keywords
    // const found = isForSale(resp.data);
    const found = isForSale5(resp.data);

    return found;
  },
};
