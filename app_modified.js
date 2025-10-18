// Test Analysis Application
class TestAnalysisApp {
    constructor() {
        this.isLoggedIn = false;
        this.testRecords = [];
        this.loginState = false;
        this.validCredentials = {
            username: 'AIR1Test@analysis',
            password: 'Max@2026',
        };

        // Load saved records from localStorage
        this.loadRecordsFromStorage();
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.attachEventListeners();
        this.updateRatingDisplay();
        this.attachFormValidation();
        this.updateStatistics();
        this.populateRecordsTable();
    }

    // Authentication Methods
    checkLoginStatus() {
        const savedLoginState = localStorage.getItem('loginState');
        if (savedLoginState === 'true') {
            this.loginState = true;
            this.showMainContent();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginModal').classList.remove('d-none');
        document.getElementById('mainContent').classList.add('d-none');
    }

    showMainContent() {
        document.getElementById('loginModal').classList.add('d-none');
        document.getElementById('mainContent').classList.remove('d-none');
        this.isLoggedIn = true;
    }

    login(username, password) {
        if (username === this.validCredentials.username && 
            password === this.validCredentials.password) {
            this.loginState = true;
            localStorage.setItem('loginState', 'true');
            this.showMainContent();
            return true;
        }
        return false;
    }

    logout() {
        this.loginState = false;
        this.isLoggedIn = false;
        localStorage.setItem('loginState', 'false');
        this.showLogin();
        this.resetForm();
    }

    // Event Listeners
    attachEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Test form
        document.getElementById('testForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTestSubmission();
        });

        // Rating slider
        document.getElementById('rating').addEventListener('input', () => {
            this.updateRatingDisplay();
        });

        // Export buttons
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToExcel();
        });

        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Performance calculation listeners
        ['totalMarks', 'marksObtained'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.calculatePercentage();
            });
        });

        // Questions validation
        ['totalQuestions', 'correctQuestions', 'incorrectQuestions', 'unattemptedQuestions'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.validateQuestions();
            });
        });
    }

    // Login Handler
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (this.login(username, password)) {
            errorDiv.classList.add('d-none');
            document.getElementById('loginForm').reset();
        } else {
            errorDiv.textContent = 'Invalid username or password. Please try again.';
            errorDiv.classList.remove('d-none');

            // Add shake animation
            document.querySelector('.login-card').style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.querySelector('.login-card').style.animation = '';
            }, 500);
        }
    }

    // Form Validation
    attachFormValidation() {
        const form = document.getElementById('testForm');
        const inputs = form.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearValidation(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity() && value !== '';

        if (!isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else {
            field.classList.add('is-valid');
            field.classList.remove('is-invalid');
        }

        return isValid;
    }

    clearValidation(field) {
        field.classList.remove('is-invalid', 'is-valid');
    }

    validateQuestions() {
        const total = parseInt(document.getElementById('totalQuestions').value) || 0;
        const correct = parseInt(document.getElementById('correctQuestions').value) || 0;
        const incorrect = parseInt(document.getElementById('incorrectQuestions').value) || 0;
        const unattempted = parseInt(document.getElementById('unattemptedQuestions').value) || 0;

        const sum = correct + incorrect + unattempted;

        if (total > 0 && sum !== total) {
            this.showWarning('The sum of correct, incorrect, and unattempted questions should equal total questions.');
        }
    }

    calculatePercentage() {
        const totalMarks = parseFloat(document.getElementById('totalMarks').value) || 0;
        const marksObtained = parseFloat(document.getElementById('marksObtained').value) || 0;

        if (totalMarks > 0) {
            const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
            document.getElementById('marksPercentage').textContent = `${percentage}%`;

            // Validate marks obtained doesn't exceed total marks
            if (marksObtained > totalMarks) {
                this.showWarning('Marks obtained cannot exceed total marks.');
                document.getElementById('marksObtained').classList.add('is-invalid');
            }
        } else {
            document.getElementById('marksPercentage').textContent = '';
        }
    }

    updateRatingDisplay() {
        const rating = document.getElementById('rating').value;
        document.getElementById('ratingValue').textContent = rating;
    }

    showWarning(message) {
        // Create temporary warning toast
        const toast = document.createElement('div');
        toast.className = 'alert alert-warning alert-dismissible position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 10000; max-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    // Test Submission
    handleTestSubmission() {
        const formData = this.getFormData();

        if (this.validateFormData(formData)) {
            this.saveTestRecord(formData);
            this.showSuccessModal();
            this.resetForm();
            this.updateStatistics();
            this.populateRecordsTable();
        }
    }

    getFormData() {
        return {
            id: Date.now(), // Unique ID
            coaching: document.getElementById('coaching').value,
            subject: document.getElementById('subject').value,
            chapter: document.getElementById('chapter').value,
            testDate: document.getElementById('testDate').value,
            testBookletCode: document.getElementById('testBookletCode').value,
            totalQuestions: parseInt(document.getElementById('totalQuestions').value),
            totalMarks: parseFloat(document.getElementById('totalMarks').value),
            marksObtained: parseFloat(document.getElementById('marksObtained').value),
            correctQuestions: parseInt(document.getElementById('correctQuestions').value),
            incorrectQuestions: parseInt(document.getElementById('incorrectQuestions').value),
            unattemptedQuestions: parseInt(document.getElementById('unattemptedQuestions').value),
            rating: parseInt(document.getElementById('rating').value),
            remarks: document.getElementById('remarks').value,
            submittedAt: new Date().toISOString()
        };
    }

    validateFormData(data) {
        // Basic validation
        const requiredFields = ['coaching', 'subject', 'chapter', 'testDate', 'testBookletCode'];

        for (let field of requiredFields) {
            if (!data[field]) {
                this.showWarning(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return false;
            }
        }

        // Numeric validations
        if (data.marksObtained > data.totalMarks) {
            this.showWarning('Marks obtained cannot exceed total marks.');
            return false;
        }

        const questionSum = data.correctQuestions + data.incorrectQuestions + data.unattemptedQuestions;
        if (questionSum !== data.totalQuestions) {
            this.showWarning('The sum of correct, incorrect, and unattempted questions must equal total questions.');
            return false;
        }

        return true;
    }

    saveTestRecord(data) {
        this.testRecords.push(data);
        this.saveRecordsToStorage();
    }

    resetForm() {
        document.getElementById('testForm').reset();
        document.getElementById('ratingValue').textContent = '5';
        document.getElementById('marksPercentage').textContent = '';

        // Clear validation classes
        const inputs = document.querySelectorAll('.is-valid, .is-invalid');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }

    showSuccessModal() {
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    }

    // Data Management with LocalStorage
    loadRecordsFromStorage() {
        try {
            const saved = localStorage.getItem('testRecords');
            if (saved) {
                this.testRecords = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading records from storage:', e);
            this.testRecords = [];
        }
    }

    saveRecordsToStorage() {
        try {
            localStorage.setItem('testRecords', JSON.stringify(this.testRecords));
            console.log('Records saved to localStorage:', this.testRecords.length, 'records');
        } catch (e) {
            console.error('Error saving records to storage:', e);
        }
    }

    // Statistics
    updateStatistics() {
        const totalTests = this.testRecords.length;
        document.getElementById('totalTests').textContent = totalTests;

        if (totalTests > 0) {
            // Calculate average score
            const totalPercentage = this.testRecords.reduce((sum, record) => {
                return sum + ((record.marksObtained / record.totalMarks) * 100);
            }, 0);
            const averageScore = (totalPercentage / totalTests).toFixed(1);
            document.getElementById('averageScore').textContent = `${averageScore}%`;

            // Calculate best score
            const bestScore = Math.max(...this.testRecords.map(record => 
                (record.marksObtained / record.totalMarks) * 100
            )).toFixed(1);
            document.getElementById('bestScore').textContent = `${bestScore}%`;

            // Calculate average rating
            const totalRating = this.testRecords.reduce((sum, record) => sum + record.rating, 0);
            const averageRating = (totalRating / totalTests).toFixed(1);
            document.getElementById('averageRating').textContent = averageRating;
        } else {
            document.getElementById('averageScore').textContent = '0%';
            document.getElementById('bestScore').textContent = '0%';
            document.getElementById('averageRating').textContent = '0.0';
        }
    }

    // Records Table
    populateRecordsTable() {
        const tbody = document.getElementById('recordsBody');
        const noRecords = document.getElementById('noRecords');

        if (this.testRecords.length === 0) {
            tbody.innerHTML = '';
            noRecords.classList.remove('d-none');
            return;
        }

        noRecords.classList.add('d-none');

        tbody.innerHTML = this.testRecords.map((record, index) => {
            const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
            const date = new Date(record.testDate).toLocaleDateString();

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${date}</td>
                    <td>${this.escapeHtml(record.coaching)}</td>
                    <td>${this.escapeHtml(record.subject)}</td>
                    <td>${this.escapeHtml(record.chapter)}</td>
                    <td>${this.escapeHtml(record.testBookletCode)}</td>
                    <td>${record.marksObtained}/${record.totalMarks}</td>
                    <td><span class="badge bg-primary">${percentage}%</span></td>
                    <td>${record.correctQuestions}/${record.totalQuestions}</td>
                    <td class="text-warning">${record.incorrectQuestions}</td>
                    <td class="text-muted">${record.unattemptedQuestions}</td>
                    <td>
                        <div class="rating-stars">
                            ${this.generateStars(record.rating)}
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteRecord(${record.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 10; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-muted"></i>';
            }
        }
        return stars;
    }

    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.testRecords = this.testRecords.filter(record => record.id !== id);
            this.saveRecordsToStorage();
            this.updateStatistics();
            this.populateRecordsTable();
        }
    }

    // Export to Excel
    exportToExcel() {
        if (this.testRecords.length === 0) {
            this.showWarning('No records to export.');
            return;
        }

        // Create workbook
        const data = [
            ['Date', 'Coaching', 'Subject', 'Chapter', 'Test Code', 'Total Marks', 'Marks Obtained', 'Percentage', 
             'Total Questions', 'Correct', 'Incorrect', 'Unattempted', 'Rating', 'Remarks']
        ];

        this.testRecords.forEach(record => {
            const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(2);
            data.push([
                new Date(record.testDate).toLocaleDateString(),
                record.coaching,
                record.subject,
                record.chapter,
                record.testBookletCode,
                record.totalMarks,
                record.marksObtained,
                percentage + '%',
                record.totalQuestions,
                record.correctQuestions,
                record.incorrectQuestions,
                record.unattemptedQuestions,
                record.rating,
                record.remarks
            ]);
        });

        // Convert to CSV format
        const csv = data.map(row => row.map(cell => {
            // Escape quotes and wrap in quotes if needed
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        }).join(',')).join('\n');

        // Create Excel file using data URI
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `test_analysis_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export to PDF
    exportToPDF() {
        if (this.testRecords.length === 0) {
            this.showWarning('No records to export.');
            return;
        }

        // Create a new window with the table for printing
        const printWindow = window.open('', '_blank');
        const records = this.testRecords;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Analysis Report
        <img src="neet_logo.png" alt="NEET" width="40">
    </title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: white;
        }
        h1 {
            color: #21808d;
            text-align: center;
            margin-bottom: 10px;
        }
        .report-info {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th {
            background-color: #21808d;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #1a6870;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f0f0f0;
        }
        .percentage {
            font-weight: bold;
            color: #21808d;
        }
        .rating-stars {
            color: #ffc107;
        }
        .summary {
            margin-top: 30px;
            padding: 15px;
            background-color: #f5f5f5;
            border-left: 4px solid #21808d;
        }
        .summary h3 {
            margin-top: 0;
            color: #21808d;
        }
        @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
        }
    </style>
</head>
<body>
    <h1>Test Analysis Report - By Subha</h1>
    <div class="report-info">
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Total Records: ${records.length}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Coaching</th>
                <th>Subject</th>
                <th>Chapter</th>
                <th>Test Code</th>
                <th>Score</th>
                <th>%</th>
                <th>C/I/U</th>
                <th>Rating</th>
            </tr>
        </thead>
        <tbody>
            ${records.map((record, index) => {
                const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${new Date(record.testDate).toLocaleDateString()}</td>
                        <td>${this.escapeHtml(record.coaching)}</td>
                        <td>${this.escapeHtml(record.subject)}</td>
                        <td>${this.escapeHtml(record.chapter)}</td>
                        <td>${this.escapeHtml(record.testBookletCode)}</td>
                        <td>${record.marksObtained}/${record.totalMarks}</td>
                        <td class="percentage">${percentage}%</td>
                        <td>${record.correctQuestions}/${record.incorrectQuestions}/${record.unattemptedQuestions}</td>
                        <td class="rating-stars">${'★'.repeat(record.rating)}${'☆'.repeat(10-record.rating)}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    </table>

    <div class="summary">
        <h3>Summary Statistics</h3>
        <p><strong>Average Score:</strong> ${document.getElementById('averageScore').textContent}</p>
        <p><strong>Best Score:</strong> ${document.getElementById('bestScore').textContent}</p>
        <p><strong>Average Rating:</strong> ${document.getElementById('averageRating').textContent}</p>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TestAnalysisApp();
});
