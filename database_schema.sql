-- database_schema.sql
-- Test Analysis System Database Schema

CREATE DATABASE IF NOT EXISTS test_analysis_db;
USE test_analysis_db;

-- Main test submissions table
CREATE TABLE IF NOT EXISTS test_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coaching_institute VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    chapter VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    test_booklet_code VARCHAR(50) NOT NULL,
    total_questions INT NOT NULL,
    total_marks INT NOT NULL,
    marks_obtained INT NOT NULL,
    total_correct_questions INT NOT NULL,
    total_incorrect_questions INT NOT NULL,
    total_unattempted_questions INT NOT NULL,
    test_review TEXT NOT NULL,
    review_scale INT NOT NULL CHECK (review_scale >= 1 AND review_scale <= 10),
    remarks TEXT,
    percentage_score DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained / total_marks) * 100) STORED,
    accuracy_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((total_correct_questions / total_questions) * 100) STORED,
    submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for better query performance
    INDEX idx_subject (subject),
    INDEX idx_coaching (coaching_institute),
    INDEX idx_test_date (test_date),
    INDEX idx_percentage (percentage_score),
    INDEX idx_accuracy (accuracy_percentage)
);

-- Sample data insertion
INSERT INTO test_submissions (
    coaching_institute, subject, chapter, test_date, test_booklet_code,
    total_questions, total_marks, marks_obtained, total_correct_questions,
    total_incorrect_questions, total_unattempted_questions, test_review,
    review_scale, remarks
) VALUES 
('Allen', 'Physics', 'Mechanics', '2024-10-15', 'PHY001', 60, 240, 180, 45, 10, 5, 'Good conceptual questions with moderate difficulty', 8, 'Need to work on rotational mechanics'),
('Aakash', 'Chemistry', 'Organic Chemistry', '2024-10-14', 'CHE002', 50, 200, 160, 40, 8, 2, 'Challenging reactions and mechanisms', 7, 'Focus more on stereochemistry'),
('PW', 'Biology', 'Cell Biology', '2024-10-13', 'BIO003', 45, 180, 135, 30, 12, 3, 'Well-structured questions covering all topics', 9, 'Excellent preparation material');

-- View for quick statistics
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
    subject,
    coaching_institute,
    COUNT(*) as total_tests,
    AVG(percentage_score) as avg_percentage,
    AVG(accuracy_percentage) as avg_accuracy,
    MAX(percentage_score) as max_score,
    MIN(percentage_score) as min_score,
    AVG(review_scale) as avg_rating
FROM test_submissions 
GROUP BY subject, coaching_institute;