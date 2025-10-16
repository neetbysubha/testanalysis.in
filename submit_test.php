<?php
// submit_test.php - Handle form submission
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required_fields = [
        'coaching_institute', 'subject', 'chapter', 'test_date', 
        'test_booklet_code', 'total_questions', 'total_marks', 
        'marks_obtained', 'total_correct_questions', 'total_incorrect_questions', 
        'total_unattempted_questions', 'test_review', 'review_scale'
    ];

    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => "Field $field is required"]);
            exit;
        }
    }

    // Calculate percentages
    $percentage_score = ($input['marks_obtained'] / $input['total_marks']) * 100;
    $accuracy_percentage = ($input['total_correct_questions'] / $input['total_questions']) * 100;

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO test_submissions (
        coaching_institute, subject, chapter, test_date, test_booklet_code,
        total_questions, total_marks, marks_obtained, total_correct_questions,
        total_incorrect_questions, total_unattempted_questions, test_review,
        review_scale, remarks, percentage_score, accuracy_percentage
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("sssssiiiiiisisdd",
        $input['coaching_institute'], $input['subject'], $input['chapter'],
        $input['test_date'], $input['test_booklet_code'], $input['total_questions'],
        $input['total_marks'], $input['marks_obtained'], $input['total_correct_questions'],
        $input['total_incorrect_questions'], $input['total_unattempted_questions'],
        $input['test_review'], $input['review_scale'], $input['remarks'],
        $percentage_score, $accuracy_percentage
    );

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Test data submitted successfully!',
            'id' => $conn->insert_id,
            'percentage_score' => round($percentage_score, 2),
            'accuracy_percentage' => round($accuracy_percentage, 2)
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>