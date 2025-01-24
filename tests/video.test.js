const path = require('path');
const chai = require('chai');
const supertest = require('supertest');
const app = require('./app');

const { expect } = chai;

// Set token to authentication middleware
process.env.STATIC_TOKEN = 'static-test';

describe('POST /video/upload', () => {
  it('should upload a video file and return 201', async function () {
    this.timeout(10000);
    const res = await supertest(app)
      .post('/video/upload')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .attach('file', path.join(__dirname, './test-videos/sample-5s.mp4'));
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'sample-5s.mp4');
  });

  it('should not upload a video greater than max file size', async function () {
    this.timeout(10000);
    const res = await supertest(app)
      .post('/video/upload')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .attach('file', path.join(__dirname, './test-videos/sample_1920x1080.mp4'));
    expect(res.status).to.equal(500);
    expect(res.text).to.include('MulterError: File too large');
  });

  it('should return 400 for no file upload', async function () {
    this.timeout(10000);
    const res = await supertest(app)
      .post('/video/upload')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .attach('file', null);
    expect(res.status).to.equal(400);
    expect(res.text).to.include('No file uploaded');
  });

  it('should return 403 for missing Auth Token', async () => {
    const res = await supertest(app)
      .post('/video/upload')
      .attach('file', path.join(__dirname, './test-videos/sample-5s.mp4'));
    expect(res.status).to.equal(403);
    expect(res.text).to.include('Forbidden: Invalid or missing API token');
  });
});

describe('POST /video/merge', () => {
  it('should upload a video file and return 201', async function () {
    this.timeout(10000);
    const res = await supertest(app)
      .post('/video/upload')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .attach('file', path.join(__dirname, './test-videos/sample-5s.mp4'));
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'sample-5s.mp4');
  });

  it('should return 200 for merging videos', async function () {
    this.timeout(10000);
    const res = await supertest(app)
      .post('/video/merge')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .send({
        videoIds: [1, 2],
      });
    expect(res.status).to.equal(200);
    expect(res.text).to.include('merged-');
  });

  it('should return 403 for missing Auth Token', async () => {
    const res = await supertest(app).post('/video/trim/2').send({
      end: 10,
      start: 3,
    });
    expect(res.status).to.equal(403);
    expect(res.text).to.include('Forbidden: Invalid or missing API token');
  });

  it('should return 400 for validation error', async () => {
    const res = await supertest(app)
      .post('/video/merge')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .send({
        videoIds: [1],
      });
    expect(res.status).to.equal(400);
    expect(res.text).to.include('videoIds must be a non-empty array with minimum 2 videoIds');
  });

  it('should return 400 for validation error', async () => {
    const res = await supertest(app)
      .post('/video/merge')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .send({
        videoIds: ['A'],
      });
    expect(res.status).to.equal(400);
    expect(res.text).to.include('Each videoId must be an integer');
  });
});

describe('POST /video/trim/:videoId', () => {
  it('should return 200 for valid trim params and valid auth token', async () => {
    const res = await supertest(app)
      .post('/video/trim/1')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .send({
        end: 10,
        start: 3,
      });
    expect(res.status).to.equal(200);
    expect(res.text).to.include('trimmed-');
  });

  it('should return 403 for missing Auth Token', async () => {
    const res = await supertest(app).post('/video/trim/2').send({
      end: 10,
      start: 3,
    });
    expect(res.status).to.equal(403);
    expect(res.text).to.include('Forbidden: Invalid or missing API token');
  });

  it('should return 400 for validation error', async () => {
    const res = await supertest(app)
      .post('/video/trim/a')
      .set('x-auth-token', process.env.STATIC_TOKEN);
    expect(res.status).to.equal(400);
    expect(res.text).to.include('videoId must be an integer');
  });

  it('should return 400 for validation error', async () => {
    const res = await supertest(app)
      .post('/video/trim/1')
      .set('x-auth-token', process.env.STATIC_TOKEN)
      .send({
        start: 3,
      });
    expect(res.status).to.equal(400);
    expect(res.text).to.include('End Time is required');
  });
});

describe('POST /video/share/:videoId', () => {
  it('should return 201 for valid videoId with valid token', async () => {
    const res = await supertest(app)
      .post('/video/share/2')
      .set('x-auth-token', process.env.STATIC_TOKEN);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Shareable link generated successfully');
  });

  it('should return 403 for missing Auth Token', async () => {
    const res = await supertest(app).post('/video/share/2');
    expect(res.status).to.equal(403);
    expect(res.text).to.include('Forbidden: Invalid or missing API token');
  });

  it('should return 400 for validation error', async () => {
    const res = await supertest(app)
      .post('/video/share/a')
      .set('x-auth-token', process.env.STATIC_TOKEN);
    expect(res.status).to.equal(400);
    expect(res.text).to.include('videoId must be an integer');
  });
});
