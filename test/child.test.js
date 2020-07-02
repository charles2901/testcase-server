const request = require("supertest");
const app = require("../app");
const { Parent } = require("../models");
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const jwtSign = require('../helper/jwtSign')
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
    Parent.create(form)
    .then(parent => {
        token = jwtSign(parent)
        done()
    })
    .catch(err => {
        done(err)
    })
})

afterAll((done) => {
    queryInterface.bulkDelete('Children', null, {})
    .then( () => {
        queryInterface.bulkDelete('Parents', null, {})
    })
    .then(() => {
        done()
    })
    .catch( err => {
        done(err)
    })
});

describe("Child testing" , () => {
    describe('Get all children', () => {
        it('Should return array of children obj', (done) => {
            request(app)
            .get('/child')
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBe(true);
                done();
            })
            .catch(err => {
                done(err)
            })
        })
    })

    
    describe('Add child', () => {
        let form = {
            name : 'Charles',
            gender: 'male',
            birthDate: new Date(),
            condition: 'healthy'
        }
        it('Should return 200 and obj of child', (done) => {
            request(app)
            .post('/child')
            .set('access_token', token)
            .send(form)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(201);
                expect(body).toHaveProperty("name");
                expect(body).toHaveProperty("gender");
                expect(body).toHaveProperty("birthDate");
                expect(body).toHaveProperty("condition");  
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    })
    
})