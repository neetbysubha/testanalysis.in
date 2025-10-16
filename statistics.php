<?php
// statistics.php - Get performance statistics
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'config.php';

// Overall statistics
$overall_stats = $conn->query("
    SELECT 
        COUNT(*) as total_tests,
        AVG(percentage_score) as avg_percentage,
        AVG(accuracy_percentage) as avg_accuracy,
        MAX(percentage_score) as max_score,
        MIN(percentage_score) as min_score,
        AVG(review_scale) as avg_rating
    FROM test_submissions
")->fetch_assoc();

// Subject-wise performance
$subject_stats = [];
$subject_query = $conn->query("
    SELECT 
        subject,
        COUNT(*) as test_count,
        AVG(percentage_score) as avg_score,
        AVG(accuracy_percentage) as avg_accuracy
    FROM test_submissions 
    GROUP BY subject
    ORDER BY avg_score DESC
");

while ($row = $subject_query->fetch_assoc()) {
    $subject_stats[] = $row;
}

// Coaching institute performance
$coaching_stats = [];
$coaching_query = $conn->query("
    SELECT 
        coaching_institute,
        COUNT(*) as test_count,
        AVG(percentage_score) as avg_score
    FROM test_submissions 
    GROUP BY coaching_institute
    ORDER BY avg_score DESC
");

while ($row = $coaching_query->fetch_assoc()) {
    $coaching_stats[] = $row;
}

// Monthly performance trend
$monthly_stats = [];
$monthly_query = $conn->query("
    SELECT 
        DATE_FORMAT(test_date, '%Y-%m') as month,
        COUNT(*) as test_count,
        AVG(percentage_score) as avg_score
    FROM test_submissions 
    GROUP BY DATE_FORMAT(test_date, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
");

while ($row = $monthly_query->fetch_assoc()) {
    $monthly_stats[] = $row;
}

echo json_encode([
    'success' => true,
    'overall' => $overall_stats,
    'by_subject' => $subject_stats,
    'by_coaching' => $coaching_stats,
    'monthly_trend' => array_reverse($monthly_stats)
]);

$conn->close();
?>