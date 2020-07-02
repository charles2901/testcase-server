const request = require("supertest");
const app = require("../app");
const { Parent, Agency } = require("../models");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwtSign = require("../helper/jwtSign");

beforeAll((done) => {
  let formAgency = {
    id: 10000,
    name: "Baby Sitter Agency",
    email: "agency@outlook.co.id",
    password: "rahasia",
    address: "Bumi Mas Raya Blok B4 Nomor 2",
    city: "Tangerang",
    logoUrl:
      "https://image.shutterstock.com/image-vector/shield-letter-s-logosafesecureprotection-logomodern-260nw-633031571.jpg",
    phoneNumber: "081212498600",
  };
  let formParent = {
    id: 10000,
    name: "Charles",
    email: "chrlsjnthn2@gmail.com",
    password: "12345",
    city: "Jakarta",
    birthDate: new Date(),
    address: "Kebayoran",
    phoneNumber: "02111234567",
    gender: "male",
  };
  Agency.create(formAgency)
    .then(() => {
      return Parent.create(formParent);
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  queryInterface
    .bulkDelete("Parents", null, {})
    .then(() => {
      return queryInterface.bulkDelete("Agencies", null, {});
    })
    .then(() => {
       return queryInterface.bulkDelete("Messages", null, {})
    })
    .then(() => {
        done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("endpoint test for message", () => {
  let tokenAgency = jwtSign({dataValues: { id: 10000, email: "agency@outlook.co.id" }});
  let tokenParent = jwtSign({dataValues: { id: 10000, email: "chrlsjnthn2@gmail.com" }});

  describe("get all message agency", () => {
    it("should return array of messages", (done) => {
      request(app)
        .get("/message/agency")
        .set('access_token', tokenAgency)
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

  describe("get all message parent", () => {
    it("should return array of messages", (done) => {
      request(app)
        .get("/message/parent")
        .set('access_token', tokenParent)
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

  describe("get all message agency", () => {
    it("should return array of messages", (done) => {
      request(app)
        .get("/message/agency/10000")
        .set('access_token', tokenAgency)
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

  describe("get all message parent", () => {
    it("should return array of messages", (done) => {
      request(app)
        .get("/message/parent/10000")
        .set('access_token', tokenParent)
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

  describe("get all message agency", () => {
    it("post message agency", (done) => {
      request(app)
        .post("/message/agency/10000")
        .set('access_token', tokenAgency)
        .send({content: 'Halo', sender: 'agency'})
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("content");  
          expect(body).toHaveProperty("sender");  
          expect(body).toHaveProperty("ParentId");  
          expect(body).toHaveProperty("AgencyId");  
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("get all message parent", () => {
    it("post message parent", (done) => {
      request(app)
        .post("/message/parent/10000")
        .set('access_token', tokenParent)
        .send({content: 'Halo', sender: 'parent'})
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(201);
          expect(body).toHaveProperty("content");  
          expect(body).toHaveProperty("sender");  
          expect(body).toHaveProperty("ParentId");  
          expect(body).toHaveProperty("AgencyId");  
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("update all message read agency", () => {
    it("post message agency", (done) => {
      request(app)
        .put("/message/read/agency/10000")
        .set('access_token', tokenAgency)
        .send({content: 'Halo', sender: 'agency'})
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

  describe("update all message read parent", () => {
    it("post message parent", (done) => {
      request(app)
        .put("/message/read/parent/10000")
        .set('access_token', tokenParent)
        .send({content: 'Halo', sender: 'parent'})
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
