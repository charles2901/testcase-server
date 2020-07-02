const request = require("supertest");
const app = require("../app");
const { Agency } = require("../models");
let token = null;

beforeAll(() => {
  Agency.create({
    id: 10000,
    name: "Baby Sitter Agency",
    email: "agency@outlook.co.id",
    password: "rahasia",
    address: "Bumi Mas Raya Blok B4 Nomor 2",
    city: "Tangerang",
    logoUrl:
      "https://image.shutterstock.com/image-vector/shield-letter-s-logosafesecureprotection-logomodern-260nw-633031571.jpg",
    phoneNumber: "081212498600",
  });
});

afterAll((done) => {
  Agency.destroy({ where: {} })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Agency CRUD by agency", () => {
  describe("Register agency", () => {
    let form = {
      name: "Baby Sitter Agency",
      email: "agency2@outlook.co.id",
      password: "rahasia",
      address: "Bumi Mas Raya Blok B4 Nomor 2",
      city: "Tangerang",
      logoUrl:
        "https://image.shutterstock.com/image-vector/shield-letter-s-logosafesecureprotection-logomodern-260nw-633031571.jpg",
      phoneNumber: "081212498600",
    };
    it("Should return 200 and access token", (done) => {
      request(app)
        .post("/agency/register")
        .send(form)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("email");
          expect(body).toHaveProperty("password");
          expect(body).toHaveProperty("address");
          expect(body).toHaveProperty("city");
          expect(body).toHaveProperty("logoUrl");
          expect(body).toHaveProperty("phoneNumber");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Login agency", () => {
    let form = {
      email: "agency@outlook.co.id",
      password: "rahasia",
    };
    it("Should return 200 and access token", (done) => {
      request(app)
        .post("/agency/login")
        .send(form)
        .then((response) => {
          let { body, status } = response;
          token = body.access_token;
          expect(status).toBe(200);
          expect(body).toHaveProperty("access_token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Get all agencies data", () => {
    it("Should return 200 and array of agency object", (done) => {
      request(app)
        .get("/agency/")
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBe(true);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Get one agency data by its id", () => {
    describe("Success (id is found)", () => {
      it("Should return 200 and agency object", (done) => {
        request(app)
          .get("/agency/10000")
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(200);
            expect(body.id).toBe(10000);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("Failed (id is not found)", () => {
      it("Should return 404 and message", (done) => {
        request(app)
          .get("/agency/1000")
          .then((response) => {
            let { body, status } = response;
            expect(status).toBe(404);
            expect(body).toHaveProperty("error", "ERR_NOT_FOUND");
            expect(body).toHaveProperty("errorMessages");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe("Edit agency", () => {
    let form = {
      name: "Baby Sitter Agency Tangerang",
      email: "agency@outlook.co.id",
      password: "rahasia",
      address: "Bumi Mas Raya Blok B4 Nomor 2",
      city: "Tangerang",
      logoUrl:
        "https://image.shutterstock.com/image-vector/shield-letter-s-logosafesecureprotection-logomodern-260nw-633031571.jpg",
      phoneNumber: "081212498600",
    };
    it("Should return 200 and message", (done) => {
      request(app)
        .put("/agency/10000")
        .set("access_token", token)
        .send(form)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Delete agency", () => {
    it("Should return 200 and message", (done) => {
      request(app)
        .delete("/agency/10000")
        .set("access_token", token)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
