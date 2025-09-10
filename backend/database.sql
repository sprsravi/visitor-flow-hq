-- Create database
CREATE DATABASE IF NOT EXISTS visitor_management;
USE visitor_management;

-- Create visitors table
CREATE TABLE visitors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    mobile VARCHAR(50) NULL,
    company VARCHAR(255) NULL,
    person_to_meet VARCHAR(255) NULL,
    department VARCHAR(255) NULL,
    purpose TEXT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP NULL,
    status ENUM('checked-in', 'checked-out') DEFAULT 'checked-in',
    photo_url VARCHAR(500) NULL,
    badge_number VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_check_in_time ON visitors(check_in_time);
CREATE INDEX idx_status ON visitors(status);
CREATE INDEX idx_company ON visitors(company);

-- Insert sample data (optional)
INSERT INTO visitors (id, name, email, mobile, company, person_to_meet, department, purpose, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '1234567890', 'ABC Corp', 'Jane Smith', 'IT', 'Meeting', 'checked-in'),
('550e8400-e29b-41d4-a716-446655440001', 'Alice Johnson', 'alice@example.com', '0987654321', 'XYZ Ltd', 'Bob Wilson', 'HR', 'Interview', 'checked-out');