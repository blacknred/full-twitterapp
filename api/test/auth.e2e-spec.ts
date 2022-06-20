import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../__SANDBOX__/full-twitterapp/api/src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let user;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign in', () => {
    it('/users (POST) - should create an user', (done) => {
      return request(app.getHttpServer())
        .post('/users')
        .send(mockCreateUserDto)
        .expect(201)
        .end(done);
    });

    it('/auth (POST) - should not create a session for invalid email', (done) => {
      return request(app.getHttpServer())
        .post('/auth')
        .send(userLoginRequestFailWrongEmail)
        .expect(401)
        .expect({
          message: 'user_search_by_credentials_not_found',
          data: null,
          errors: null,
        })
        .end(done);
    });

    it('/users/login (POST) - should not create a token for invalid password', (done) => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send(userLoginRequestFailWrongPw)
        .expect(401)
        .expect({
          message: 'user_search_by_credentials_not_match',
          data: null,
          errors: null,
        })
        .end(done);
    });

    it('/users/login (POST) - should not create a token for empty body', (done) => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send()
        .expect(401)
        .expect({
          message: 'user_search_by_credentials_not_found',
          data: null,
          errors: null,
        })
        .end(done);
    });

    it('/users/login (POST) - should not create a token for string value in body', (done) => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send(userSignupRequestSuccess.email)
        .expect(401)
        .expect({
          message: 'user_search_by_credentials_not_found',
          data: null,
          errors: null,
        })
        .end(done);
    });

    it('/auth (POST) - should create a session', (done) => {
      return request(app.getHttpServer())
        .post('/auth')
        .send(mockCreateAuthDto)
        .expect(201)
        .expect((res) => {
          res.body.data.token = 'fake_value';
        })
        .expect({
          message: 'token_create_success',
          data: {
            token: 'fake_value',
          },
          errors: null,
        })
        .end(done);
    });

    it('/users/ (POST) - should create a valid user', (done) => {
      return request(app.getHttpServer())
        .post('/users/')
        .send(userSignupRequestSuccess)
        .expect(201)
        .end(done);
    });

    it('/users/login (POST) - should create a token for valid credentials', (done) => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send(userSignupRequestSuccess)
        .expect(201)
        .expect((res) => {
          userToken = res.body.data.token;
        })
        .end(done);
    });

    it('/users/ (GET) - should retrieve user by a valid token', (done) => {
      return request(app.getHttpServer())
        .get('/users/')
        .set('Authorization', userToken)
        .send()
        .expect(200)
        .end(done);
    });
  });

  describe('Push subscriptions', () => {});

  describe('Sign out', () => {
    it('/users/logout (POST) - should destroy token for user', (done) => {
      return request(app.getHttpServer())
        .put('/users/logout')
        .set('Authorization', userToken)
        .expect(200)
        .expect({
          message: 'token_destroy_success',
          errors: null,
          data: null,
        })
        .end(done);
    });

    it('/users/ (GET) - should not retrieve user by a destroyed token', (done) => {
      return request(app.getHttpServer())
        .get('/users/')
        .set('Authorization', userToken)
        .send()
        .expect(401)
        .expect({
          message: 'token_decode_unauthorized',
          data: null,
          errors: null,
        })
        .end(done);
    });
  });
});
