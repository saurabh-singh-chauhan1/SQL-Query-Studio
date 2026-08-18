CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL,
  country TEXT
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  order_item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO customers VALUES (1, 'Alfreds Futterkiste', 'Germany'), (2, 'Around the Horn', 'UK'), (3, 'Bottom-Dollar Markets', 'Canada');
INSERT INTO orders VALUES (1, 1, '2024-01-05'), (2, 1, '2024-02-11'), (3, 2, '2024-01-20'), (4, 3, '2024-03-02');
INSERT INTO order_items VALUES
  (1, 1, 'Chai', 10, 18.0),
  (2, 1, 'Chang', 5, 19.0),
  (3, 2, 'Aniseed Syrup', 12, 10.0),
  (4, 3, 'Chai', 3, 18.0),
  (5, 4, 'Chang', 8, 19.0);
