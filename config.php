<?php
// config.php - Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "test_analysis_db";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sql = "CREATE DATABASE IF NOT EXISTS $database";
if ($conn->query($sql) === TRUE) {
    // Select the database
    $conn->select_db($database);

    // Create table if not exists
    $table_sql = "CREATE TABLE IF NOT EXISTS test_submissions (
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
        review_scale INT NOT NULL,
        remarks TEXT,
        percentage_score DECIMAL(5,2),
        accuracy_percentage DECIMAL(5,2),
        submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($table_sql) === TRUE) {
        echo "Database and table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
} else {
    echo "Error creating database: " . $conn->error;
}
?>