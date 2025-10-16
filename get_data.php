<?php
// get_data.php - Retrieve submitted data
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

include 'config.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$search = isset($_GET['search']) ? $_GET['search'] : '';
$subject_filter = isset($_GET['subject']) ? $_GET['subject'] : '';
$coaching_filter = isset($_GET['coaching']) ? $_GET['coaching'] : '';

$offset = ($page - 1) * $limit;

// Build WHERE clause
$where_conditions = [];
$params = [];
$types = '';

if (!empty($search)) {
    $where_conditions[] = "(chapter LIKE ? OR test_booklet_code LIKE ? OR test_review LIKE ?)";
    $search_param = "%$search%";
    $params = array_merge($params, [$search_param, $search_param, $search_param]);
    $types .= 'sss';
}

if (!empty($subject_filter)) {
    $where_conditions[] = "subject = ?";
    $params[] = $subject_filter;
    $types .= 's';
}

if (!empty($coaching_filter)) {
    $where_conditions[] = "coaching_institute = ?";
    $params[] = $coaching_filter;
    $types .= 's';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get total count
$count_sql = "SELECT COUNT(*) as total FROM test_submissions $where_clause";
$count_stmt = $conn->prepare($count_sql);
if (!empty($params)) {
    $count_stmt->bind_param($types, ...$params);
}
$count_stmt->execute();
$total_records = $count_stmt->get_result()->fetch_assoc()['total'];

// Get data with pagination
$data_sql = "SELECT * FROM test_submissions $where_clause ORDER BY submission_timestamp DESC LIMIT ? OFFSET ?";
$data_params = array_merge($params, [$limit, $offset]);
$data_types = $types . 'ii';

$data_stmt = $conn->prepare($data_sql);
$data_stmt->bind_param($data_types, ...$data_params);
$data_stmt->execute();
$result = $data_stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $data,
    'total_records' => $total_records,
    'current_page' => $page,
    'total_pages' => ceil($total_records / $limit)
]);

$conn->close();
?>