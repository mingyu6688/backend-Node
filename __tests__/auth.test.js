import request from 'supertest';
import app from '../app.js';

describe('Auth API Test', () => {
    let token; // 로그인 후 저장할 JWT 토큰

    beforeAll(async () => {
        // 테스트 계정 회원가입
        await request(app).post('/signup').send({
            username: 'testuser',
            password: 'testpassword',
            nickname: 'Tester'
        });

        // 로그인 후 토큰 저장
        const loginRes = await request(app).post('/login').send({
            username: 'testuser',
            password: 'testpassword'
        });
        token = loginRes.body.token;
    });

    // 회원가입 예외 케이스
    it('아이디 없이 회원가입 시 400 반환', async () => {
        const res = await request(app).post('/signup').send({
            password: 'password123',
            nickname: 'Test'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('비밀번호 없이 회원가입 시 400 반환', async () => {
        const res = await request(app).post('/signup').send({
            username: 'newuser',
            nickname: 'Test'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('이미 가입된 사용자 회원가입 시 400 반환', async () => {
        const res = await request(app).post('/signup').send({
            username: 'testuser',
            password: 'password123',
            nickname: 'Test'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('USER_ALREADY_EXISTS');
    });

    // 로그인 예외 케이스
    it('존재하지 않는 아이디로 로그인 시 400 반환', async () => {
        const res = await request(app).post('/login').send({
            username: 'notexist',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('틀린 비밀번호로 로그인 시 400 반환', async () => {
        const res = await request(app).post('/login').send({
            username: 'testuser',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('아이디 없이 로그인 시 400 반환', async () => {
        const res = await request(app).post('/login').send({
            password: 'testpassword'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    it('비밀번호 없이 로그인 시 400 반환', async () => {
        const res = await request(app).post('/login').send({
            username: 'testuser'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error.code).toBe('BAD_REQUEST');
    });

    // 보호된 경로 예외 케이스
    it('토큰 없이 보호된 경로 접근 시 401 반환', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
        expect(res.body.error.code).toBe('TOKEN_NOT_FOUND');
    });

    it('잘못된 토큰으로 보호된 경로 접근 시 403 반환', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(403);
        expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('올바른 토큰으로 보호된 경로 접근 시 200 반환', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('이 데이터는 인증된 사용자만 볼 수 있습니다.');
    });
});
