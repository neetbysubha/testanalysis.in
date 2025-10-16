<?php
// export_excel.php - Export data to Excel
require_once 'vendor/autoload.php'; // PhpSpreadsheet library
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

include 'config.php';

// Get all data
$result = $conn->query("SELECT * FROM test_submissions ORDER BY submission_timestamp DESC");

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Set headers
$headers = [
    'ID', 'Coaching Institute', 'Subject', 'Chapter', 'Test Date', 
    'Test Booklet Code', 'Total Questions', 'Total Marks', 'Marks Obtained',
    'Correct Questions', 'Incorrect Questions', 'Unattempted Questions',
    'Percentage Score', 'Accuracy Percentage', 'Review Scale', 'Test Review', 
    'Remarks', 'Submission Date'
];

$col = 'A';
foreach ($headers as $header) {
    $sheet->setCellValue($col . '1', $header);
    $col++;
}

// Add data rows
$row = 2;
while ($data = $result->fetch_assoc()) {
    $sheet->setCellValue('A' . $row, $data['id']);
    $sheet->setCellValue('B' . $row, $data['coaching_institute']);
    $sheet->setCellValue('C' . $row, $data['subject']);
    $sheet->setCellValue('D' . $row, $data['chapter']);
    $sheet->setCellValue('E' . $row, $data['test_date']);
    $sheet->setCellValue('F' . $row, $data['test_booklet_code']);
    $sheet->setCellValue('G' . $row, $data['total_questions']);
    $sheet->setCellValue('H' . $row, $data['total_marks']);
    $sheet->setCellValue('I' . $row, $data['marks_obtained']);
    $sheet->setCellValue('J' . $row, $data['total_correct_questions']);
    $sheet->setCellValue('K' . $row, $data['total_incorrect_questions']);
    $sheet->setCellValue('L' . $row, $data['total_unattempted_questions']);
    $sheet->setCellValue('M' . $row, $data['percentage_score']);
    $sheet->setCellValue('N' . $row, $data['accuracy_percentage']);
    $sheet->setCellValue('O' . $row, $data['review_scale']);
    $sheet->setCellValue('P' . $row, $data['test_review']);
    $sheet->setCellValue('Q' . $row, $data['remarks']);
    $sheet->setCellValue('R' . $row, $data['submission_timestamp']);
    $row++;
}

// Style the header row
$headerStyle = [
    'font' => ['bold' => true],
    'fill' => [
        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
        'color' => ['argb' => 'FF17A2B8']
    ]
];

$sheet->getStyle('A1:R1')->applyFromArray($headerStyle);

// Auto-size columns
foreach (range('A', 'R') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Output file
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="test_analysis_data_' . date('Y-m-d') . '.xlsx"');
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');

$conn->close();
?>