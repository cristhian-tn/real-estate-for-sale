const axios = require("axios").default;
const StrategyManager = require('./strategyManager');
const ScrapeStrategy = require('./scrapeStrategy');

module.exports = {
  handleEvent: async (event, context) => {
    validateEvents(event);
    const { data } = event;
    const response = {
      data: []
    }
    // Get Google response for each opportunity
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const resp = await axios.get(`https://www.google.com/search?q=${d.address}`);
      response.data.push({ opportunity: d.opportunity, isForSale: isPropertyForSale(resp) });
    }
    return response;
  },
};

function isPropertyForSale(resp) {
  const strategyManager = new StrategyManager();
  strategyManager.strategy = new ScrapeStrategy();
  // strategyManager.strategy = new RegexStrategy();
  const found = strategyManager.isPropertyForSale(resp.data);

  return found;
}

function validateEvents(event) {
  if (!Array.isArray(event.data)) throw new Error("'data' parameter should be an array");
  event.data.forEach(opportunityAndAddress => {
    const { address, opportunity } = opportunityAndAddress
    if (!address || address.length < 10) {
      throw new Error(
        "'address' property is required and should be a real address"
      );
    }
  })
}

