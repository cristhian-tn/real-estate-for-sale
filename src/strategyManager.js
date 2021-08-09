class StrategyManager {
  constructor() {
    this._strategy = null;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }

  get strategy() {
    return this._strategy;
  }

  isPropertyForSale(googlePageHtml) {
    return this._strategy.isPropertyForSale(googlePageHtml);
  }
}

module.exports = StrategyManager;