CREATE DATABASE myBookshop;
USE myBookshop;
CREATE TABLE books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));
INSERT INTO books (name, price)VALUES('database book', 40.25),('Node.js book', 25.00), ('Express book', 31.99) ;
CREATE user 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myBookshop.* TO 'appuser'@'localhost';

CREATE TABLE user (id INT AUTO_INCREMENT, firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, appuser VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(50) UNIQUE NOT NULL, hashedPassword VARCHAR(550) NOT NULL, PRIMARY KEY (id));
SELECT * FROM user;
DROP TABLE user;
