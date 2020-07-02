const request = require("supertest");
const app = require("../app");
const { Nanny, Agency } = require("../models");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwtSign = require("../helper/jwtSign");
let token = null;
let id = null;

beforeAll((done) => {
  let form = {
    id: 10000,
    name: "Siti",
    gender: "female",
    phoneNumber: "02111234567",
    birthDate: new Date(),
    address: "Kebayoran",
    imageUrl:
      "https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg",
    city: "Jakarta",
    expectedSalary: 1000000,
  };
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
  })
    .then(() => {
      return Nanny.create(form)
    })
    .then((nanny) => {
      id = nanny.id
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  queryInterface
    .bulkDelete("Nannies", null, {})
    .then(() => {
      return queryInterface.bulkDelete("Agencies", null, {});
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Nanny endpoint test", () => {
  let tokenAgency = jwtSign({dataValues: { id: 1, email: "agency@outlook.co.id" }});

  describe("Get all nannies", () => {
    it("Should return 200 and array of nanny obj", (done) => {
      request(app)
        .get("/nanny")
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
  describe("Register nanny data", () => {
    it("Should return 200 and nanny object", (done) => {
      let form = {
        name: "Siti",
        gender: "female",
        phoneNumber: "02111234567",
        birthDate: new Date(),
        address: "Kebayoran",
        imageUrl:
          "https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg",
        city: "Jakarta",
        expectedSalary: 1000000,
      };
      request(app)
        .post("/nanny/register")
        .send(form)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("gender");
          expect(body).toHaveProperty("phoneNumber");
          expect(body).toHaveProperty("birthDate");
          expect(body).toHaveProperty("address");
          expect(body).toHaveProperty("imageUrl");
          expect(body).toHaveProperty("city");
          expect(body).toHaveProperty("expectedSalary");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("Get all nannies by AgencyId", () => {
    token = jwtSign({
      dataValues: { id: 10000, email: "agency@outlook.co.id" },
    });
    it("get all corresponding nanny", (done) => {
      request(app)
        .get("/nanny/showAssociateNanny")
        .set("access_token", token)
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
  describe('Add nanny by agency', () => {
    it('Should return 201 and nanny object', (done) => {
      let form = {
        name: "Siti",
        gender: "female",
        phoneNumber: "02111234567",
        birthDate: new Date(),
        address: "Kebayoran",
        imageUrl:
          "https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg",
        city: "Jakarta",
        expectedSalary: 1000000,
      };
      request(app)
        .post("/nanny/")
        .send(form)
        .set('access_token', tokenAgency)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("gender");
          expect(body).toHaveProperty("phoneNumber");
          expect(body).toHaveProperty("birthDate");
          expect(body).toHaveProperty("address");
          expect(body).toHaveProperty("imageUrl");
          expect(body).toHaveProperty("city");
          expect(body).toHaveProperty("expectedSalary");
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
  });
  describe('Get nanny by id', () => {
    it('should return 200 and object nanny', (done) => {
      console.log(id, '>>>>>>>>>>>')
      request(app)
        .get("/nanny/" +id)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("gender");
          expect(body).toHaveProperty("phoneNumber");
          expect(body).toHaveProperty("birthDate");
          expect(body).toHaveProperty("address");
          expect(body).toHaveProperty("imageUrl");
          expect(body).toHaveProperty("city");
          expect(body).toHaveProperty("expectedSalary");
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
  })
  describe('Update data status avail nanny', () => {
    it('Should return 200 and message', (done) => {
      request(app)
        .put("/nanny/avail/" + id)
        .set('access_token', tokenAgency)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message");
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
  });
  describe('Update data nanny', () => {
    it('Should return 200 and message', (done) => {
      let form = {
        name: "Siti 2",
        gender: "female",
        phoneNumber: "02111234567",
        birthDate: new Date(),
        address: "Kebayoran",
        imageUrl:
          "https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg",
        city: "Jakarta",
        expectedSalary: 1000000,
      };
      request(app)
        .put("/nanny/" + id)
        .send(form)
        .set('access_token', tokenAgency)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message");
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
  });
  describe('Delete nanny', () => {
    it('Should return 200 and message', (done) => {
      request(app)
        .delete("/nanny/" + id)
        .set('access_token', tokenAgency)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message");
          done();
        })
        .catch((err) => {
          done(err);
        });
    })
  });
});
