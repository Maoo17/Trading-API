DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS product;
CREATE TABLE IF NOT EXISTS user (
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255),
  birthday DATE,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(60) NOT NULL,
  UNIQUE(email)
);
CREATE TABLE IF NOT EXISTS product (
  ownerId VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  price INT NOT NULL,
  open BOOLEAN NOT NULL DEFAULT 0
);
INSERT INTO
  product (ownerId, title, amount, price, open)
VALUES
  ("test@gmail.com", "Pikachu", 10, 100, 1),
  ("test@gmail.com", "Raichu", 5, 400, 0);