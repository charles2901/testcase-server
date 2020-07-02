const request = require("supertest");
const app = require("../app");
const { Parent, NannyWishlist, Nanny } = require("../models");
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
    let formNanny = {
        id: 10000,
        name : 'Siti',
        gender : 'female',
        phoneNumber : '02111234567',
        birthDate: new Date(),
        address: 'Kebayoran',
        imageUrl: 'https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg',
        city: 'Jakarta',
        expectedSalary: 1000000,
    }
    let nannyWishlistForm = {
        id: 10000,
        name : 'Siti',
        gender : 'female',
        phoneNumber : '02111234567',
        birthDate: new Date(),
        address: 'Kebayoran',
        imageUrl: 'https://www.jetorbit.com/blog/wp-content/uploads/2019/06/apa-itu-url.jpg',
        city: 'Jakarta',
        ParentId: 10000,
        expectedSalary: 1000000,
    }
    Parent.create(form)
    .then(parent => {
        token = jwtSign(parent)
        return Nanny.create(formNanny)
    })
    .then(() => {
        return NannyWishlist.create(nannyWishlistForm)
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
        return queryInterface.bulkDelete('NannyWishlists', null, {})
    })
    .then( () => {
        return queryInterface.bulkDelete('Nannies', null, {})
    })
    .then( () => {
        done()
    })
    .catch( err => {
        done(err)
    })
});

describe("Wishlist testing" , () => {
    describe('Get all shortlist', () => {
        it('Should return 200 and array obj of shortlist parent', (done) => {
            request(app)
            .get('/wishlist')
            .set('access_token', token)
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
    })

    describe('Add to shortlist', () => {
        it('Should return 201 and obj of shortlist candidate', (done) => {
            request(app)
            .post('/wishlist/add/10000')
            .set('access_token', token)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(201);
                expect(body).toHaveProperty("name");
                expect(body).toHaveProperty("gender");
                expect(body).toHaveProperty("phoneNumber");
                expect(body).toHaveProperty("birthDate");
                expect(body).toHaveProperty("address");
                expect(body).toHaveProperty("imageUrl");
                expect(body).toHaveProperty("city");
                expect(body).toHaveProperty("expectedSalary");  
                done()
            })
            .catch(err => {
                done(err)
            })
        })
    })

    describe('Delete shortlist', () => {
        it('Should return 200 and message', (done) => {
            request(app)
            .delete('/wishlist/delete/10000')
            .set('access_token', token)
            .then(response => {
                let { body, status } = response;
                expect(status).toBe(200);
                expect(body).toHaveProperty("message");
                done()
            })
            .catch(err => {
                console.log(err)
                done(err)
            })
        })
    })
})