# Test Analysis System - Installation Guide

## Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Composer (for PHP dependencies)

## Installation Steps

### 1. Setup Web Server
- Place all files in your web server document root (e.g., htdocs, www, public_html)
- Ensure PHP and MySQL are properly configured

### 2. Install PHP Dependencies
```bash
composer install
```
This will install PhpSpreadsheet library for Excel export functionality.

### 3. Database Setup
- Create a MySQL database named `test_analysis_db`
- Update database credentials in `config.php` if needed
- Run `config.php` once to create the database table automatically

### 4. File Permissions
- Ensure web server has read/write permissions on the project directory
- Set proper permissions for file uploads and exports

### 5. Configuration
- Update `config.php` with your database credentials
- Modify CORS settings in PHP files if accessing from different domain

## File Structure
```
test-analysis-system/
├── index.html              # Main frontend application
├── config.php              # Database configuration
├── submit_test.php          # Form submission handler
├── get_data.php            # Data retrieval API
├── statistics.php          # Statistics API
├── export_excel.php        # Excel export functionality
├── composer.json           # PHP dependencies
└── README.md               # This file
```

## Features
- ✅ Responsive design for all devices
- ✅ Form validation and error handling
- ✅ Data persistence in MySQL database
- ✅ Real-time statistics and analytics
- ✅ Excel export functionality
- ✅ Search and filter capabilities
- ✅ Performance tracking and trends

## Usage
1. Open index.html in your web browser
2. Fill out the test analysis form
3. View statistics and submitted data
4. Export data to Excel format

## Troubleshooting
- Ensure PHP extensions: mysqli, json, mbstring are enabled
- Check file permissions for write access
- Verify database connection in config.php
- Enable error reporting in PHP for debugging

## API Endpoints
- POST /submit_test.php - Submit new test data
- GET /get_data.php - Retrieve submitted data with pagination
- GET /statistics.php - Get performance statistics
- GET /export_excel.php - Download Excel file
