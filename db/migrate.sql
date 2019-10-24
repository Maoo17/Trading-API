DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS deposit;
CREATE TABLE IF NOT EXISTS user (
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255),
  birthday DATE,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(60) NOT NULL,
  balance VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  UNIQUE(email)
);
CREATE TABLE IF NOT EXISTS deposit (
  depositId Integer primary key autoincrement,
  ownerId VARCHAR(255) NOT NULL,
  productId INT NOT NULL
);
CREATE TABLE IF NOT EXISTS history (
  email VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS product (
  id integer primary key autoincrement,
  title VARCHAR(255) NOT NULL,
  startingPrice INT NOT NULL,
  rate FLOAT NOT NULL,
  variance FLOAT NOT NULL
);
INSERT INTO
  deposit (ownerId, productId)
VALUES
  ("test@gmail.com", 1),
  ("test@gmail.com", 2);
INSERT INTO
  product (title, startingPrice, rate, variance)
VALUES
  ("Pikachu", 100, 1.001, 0.4),
  ("Mewto", 250, 1.005, 0.2),
  ("Pidgey", 30, 1.002, 0.9),
  ("Charizard", 700, 1.008, 0.1),
  ("Blastoise", 1000, 1.003, 0.5);