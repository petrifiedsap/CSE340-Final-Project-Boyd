-- Database seed file for student course catalog
-- This file creates tables and inserts all initial data

BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT,
    color VARCHAR(25) NOT NULL,
    premium BOOLEAN NOT NULL DEFAULT FALSE,
    base_price INTEGER NOT NULL CHECK (base_price > 0),
    price_installed INTEGER NOT NULL CHECK (price_installed > 0),
    slug VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert products
INSERT INTO products (name, description, color, premium, base_price, price_installed, slug) VALUES
    ('Hardwood Mulch', 'Lovely brown hardwood mulch ideal for your garden', 'Brown', FALSE, 5, 7, 'brown_reg'),
    ('Hardwood Mulch', 'Lovely black hardwood mulch ideal for your garden', 'Black', FALSE, 5, 7, 'black_reg'),
    ('Hardwood Mulch', 'Lovely red hardwood mulch ideal for your garden', 'Red', FALSE, 5, 7, 'red_reg'),
    ('Premium Hardwood Mulch', 'Premium brown hardwood mulch ideal for your garden', 'Brown', TRUE, 7, 9, 'brown_prem'),
    ('Premium Hardwood Mulch', 'Premium black hardwood mulch ideal for your garden', 'Black', TRUE, 7, 9, 'black_prem'),
    ('Premium Cedar Mulch', 'Premium red cedar mulch ideal for your garden', 'Red', TRUE, 7, 9, 'cedar'),
    ('American Flag', 'American Flag exchange', 'Red, White and Blue', FALSE, 10, 15, 'flag');

COMMIT;