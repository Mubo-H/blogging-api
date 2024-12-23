const request = require("supertest");
const app = require("../server"); // Assuming you export the app instance

describe("POST /api/signup", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/api/signup").send({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });
});
