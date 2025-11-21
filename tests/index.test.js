require ('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('Resource /my-movies', () => {
    it('should return 200 OK and an array of movies', async () => {
        const res = await request(app).get('/my-movies/testing@gmail.com/token123456');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Favorite movies retrieved successfully');
    });

    it('shloud return unathorized 401 if token is invalid', async () => {
        const res = await request(app).get('/my-movies/testing@gmail.com/token123456x');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized: Invalid token');
    });

    it('should return success to add favorite movie with 201 OK', async () => {
        const res = await request(app)
            .post('/my-movies')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                token: 'token123456',
                data: { id: 2, title: 'InceptionZZ', desc: "testdesc2" }
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Favorite movie added successfully');
    });

    it('should return success to remove favorite movie with 204 no content', async () => {
        const res = await request(app)
            .delete('/my-movies')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                token: 'token123456',
                movieID: 1
            });
        expect(res.statusCode).toBe(204);
        expect(res.body.message).toBe('Favorite movie removing successfully');
    });

    it('should return failed to add favorite movie with 500 if server error', async () => {
        const res = await request(app)
            .post('/my-movies')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                token: 'token123456x',
                data: { id: 1, title: 'Inception', desc: "testdesc" }
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized: Invalid token');
    });
});

describe('Resource /my-token', () => {
    it('should return 200 OK when sign in with valid credentials', async () => {
        const res = await request(app)
            .post('/my-token')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                password: '123qwerty',
                token: 'token123456'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Token is valid');
    });

    it('should return 400 Bad Request when sign in with invalid password', async () => {
        const res = await request(app)
            .post('/my-token')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                password: '123qwertyx',
                token: 'token123456'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid password');
    });

    it('should return 400 Bad Request when sign in with unregistered email', async () => {
        const res = await request(app)
            .post('/my-token')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.comx',
                password: '123qwerty',
                token: 'token123456'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('User not found');
    });

    it('should return 204 No Content when sign out with valid token', async () => {
        const res = await request(app)
            .delete('/my-token')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                token: 'token123456'
            });
        expect(res.statusCode).toBe(204);
        expect(res.body.message).toBe('Sign out successful');
    });
});

describe('Resource /sign-up', () => {
    it('should return 201 Created when sign up with new email', async () => {
        const res = await request(app)
            .post('/sign-up')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing3@gmail.com',
                password: '123qwertyz'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User created successfully');
    });

    it('should return 400 Bad Request when sign up with existing email', async () => {
        const res = await request(app)
            .post('/sign-up')
            .set('Content-Type', 'application/json')    
            .send({
                email: 'testing@gmail.com',
                password: '123qwerty'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });
})