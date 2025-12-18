-- sqlite3 users.db < init_db_sample_users.sql

-- 사용자 데이터 삽입
INSERT INTO users (username, password) VALUES 
    ('user1', 'pw1'),
    ('user2', 'pw2'),
    ('user3', 'pw3');