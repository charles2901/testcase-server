const request = require("supertest");
const app = require("../app");
const { Parent, Child } = require("../models");
const { sequelize } = require('../models')
const { queryInterface } = sequelize
let token = null

beforeAll((done) => {
    let form = {
        id: 10000,
        name : 'Charles',
        email : 'chrlsjnthn2@gmail.com',
        password : '12345',
        city : 'Jakarta',
        birthDate : new Date(),
        address : 'Kebayoran',
        phoneNumber : "02111234567",
        gender : "male",
    }
    let childForm = {
        id: 10000,
        name: 'Ayu',
        gender: 'female',
        birthDate: new Date(),
        condition: 'Sehat',
        ParentId: 10000
    }
    Parent.create(form)
    .then(() => {
        return Child.create(childForm)
    })
    .then(() => {
        done()
    })
    .catch(err => {
        done(err)
    })
})

afterAll((done) => {
    queryInterface.bulkDelete('Parents', null, {})
    .then( () => {
        queryInterface.bulkDelete('Children', null, {})
    })
    .then( () => {
        done()
    })
    .catch( err => {
        done(err)
    })
});

describe("Testing for endpoint /parent", () => {
    describe("Register parent data", () => {
        let form = {
            name : 'Charles',
            email : 'chrlsjnthn@gmail.com',
            password : '12345',
            city : 'Jakarta',
            birthDate : new Date(),
            address : 'Kebayoran',
            phoneNumber : "02111234567",
            gender : "male",
        }
        it('Should return 200 and parent object', (done) => {
            request(app)
            .post("/parent/register")
            .send(form)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(201);
                expect(body).toHaveProperty("name");
                expect(body).toHaveProperty("email");
                expect(body).toHaveProperty("password");
                expect(body).toHaveProperty("city");
                expect(body).toHaveProperty("birthDate");
                expect(body).toHaveProperty("address");
                expect(body).toHaveProperty("phoneNumber");
                expect(body).toHaveProperty("gender");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe("Login parent", () => {
        let form = {
            email: 'chrlsjnthn@gmail.com',
            password: '12345678'
        }
        it('Should return 400 and errors', (done) => {
            request(app)
            .post("/parent/login")
            .send(form)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(400);
                expect(body).toHaveProperty("error");
                expect(body).toHaveProperty("errorMessages");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe("Login parent", () => {
        let form = {
            email: 'chrlsjnthn@gmail.com',
            password: '12345'
        }
        it('Should return 200 and access token', (done) => {
            request(app)
            .post("/parent/login")
            .send(form)
            .then(response => {
                let { body, status } = response;
                token = body.access_token 
                expect(status).toBe(200);
                expect(body).toHaveProperty("access_token");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe('Get all parent', () => {
        it('Should return 200 and array obj of parent', (done) => {
            request(app)
            .get('/parent')
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBe(true);
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe('Get parent by id', () => {
        it('Should return 200 and obj parent', (done) => {
            request(app)
            .get('/parent/10000')
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("name");
                expect(body).toHaveProperty("email");
                expect(body).toHaveProperty("password");
                expect(body).toHaveProperty("city");
                expect(body).toHaveProperty("birthDate");
                expect(body).toHaveProperty("address");
                expect(body).toHaveProperty("phoneNumber");
                expect(body).toHaveProperty("gender");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe('Update parent data', () => {
        let form = {
            name : 'Charles',
            email : 'chrlsjnthn22@gmail.com',
            password : '12345',
            city : 'Jakarta',
            birthDate : new Date(),
            address : 'Kebayoran',
            phoneNumber : "02111234567",
            gender : "male",
        }
        it('Should return 200 and message', (done) => {
            request(app)
            .put('/parent/10000')
            .set("access_token", token)
            .send(form)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("message");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    }),

    describe('Update parent data', () => {
        it('Should return 200 and message', (done) => {
            request(app)
            .delete('/parent/10000')
            .set("access_token", token)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("message");
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    })

    // describe('Get all parent children', () => {
    //     it('Should return 200 and array obj of parent children', (done) => {
    //         request(app)
    //         .get('/parent/allchildren')
    //         .set("access_token", token)
    //         .then(response => {
    //             let { body, status } = response;
    //             expect(status).toBe(200);
    //             expect(Array.isArray(body)).toBe(true);
    //             done()
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             done(err)
    //         })
    //     })
    // })
})