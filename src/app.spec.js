const app = require("./app");

describe("App - handleEvent", () => {
  it("should throw if no real address is provided", async () => {
    expect.assertions(1);
    await expect(app.handleEvent({})).rejects.toHaveProperty(
      "message",
      "'data' parameter should be an array"
    );
  });
  it("should find my addresses as possible real estates for sale", async () => {
    const event = {
      data: [{
        address: "1781 County Road 3300, Kempner, TX 76539",
        opportunity: {}
      }, {
        address: "1781 County Road 3300, Kempner, TX 76539",
        opportunity: {}
      }]
    };

    const data = await app.handleEvent(event);
    expect(data.data[0].isForSale).toBe(true);
    expect(data.data[1].isForSale).toBe(true);
    expect(data.data[1].opportunity).toEqual({});
  }, 3600000);
});
