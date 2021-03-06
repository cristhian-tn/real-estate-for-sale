const app = require("./app");

describe("App - handleEvent", () => {
  it("should throw if no real address is provided", async () => {
    expect.assertions(1);
    await expect(app.handleEvent()).rejects.toHaveProperty(
      "message",
      "'address' parameter is required and should be a real address"
    );
  });
  it("should find my address as a possible real estate for sale", async () => {
    const event = {
      address: "1781 County Road 3300, Kempner, TX 76539",
    };
    const data = await app.handleEvent(event);
    expect(data).toBe(true);
  });
});
