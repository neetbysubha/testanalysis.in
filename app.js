// Test Analysis Application
class TestAnalysisApp {
    constructor() {
        this.isLoggedIn = false;
        this.testRecords = [];
        this.loginState = false;
        this.validCredentials = {
            username: 'AIR1Test@analysis',
            password: 'Max@1808',
        };
        
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
        if (this.loginState) {
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
            this.showMainContent();
            return true;
        }
        return false;
    }

    logout() {
        this.loginState = false;
        this.isLoggedIn = false;
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

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
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
        this.saveRecords();
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

    // Data Management
    loadRecords() {
        // Using in-memory storage for the sandboxed environment
        return this.testRecords || [];
    }

    saveRecords() {
        // Data is automatically saved in memory as this.testRecords array
        // In a production environment, this would be sent to a backend server
        console.log('Records saved to memory:', this.testRecords.length, 'records');
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
                    <td>${date}</td>
                    <td><span class="badge bg-primary">${record.coaching}</span></td>
                    <td><span class="badge bg-info">${record.subject}</span></td>
                    <td>${record.chapter}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="progress me-2" style="width: 60px; height: 20px;">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${percentage}%" 
                                     aria-valuenow="${percentage}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                </div>
                            </div>
                            <span class="fw-bold">${percentage}%</span>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            ${this.generateStars(record.rating)}
                            <span class="ms-2">${record.rating}/10</span>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="app.deleteRecord(${record.id})" 
                                title="Delete Record">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info ms-1" 
                                onclick="app.viewDetails(${record.id})" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2;
        const emptyStars = 5 - fullStars - halfStar;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }
        
        return stars;
    }

    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.testRecords = this.testRecords.filter(record => record.id !== id);
            this.saveRecords();
            this.populateRecordsTable();
            this.updateStatistics();
        }
    }

    viewDetails(id) {
        const record = this.testRecords.find(r => r.id === id);
        if (!record) return;
        
        const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-info-circle me-2"></i>Test Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Academic Information</h6>
                                <p><strong>Coaching:</strong> ${record.coaching}</p>
                                <p><strong>Subject:</strong> ${record.subject}</p>
                                <p><strong>Chapter:</strong> ${record.chapter}</p>
                                <p><strong>Test Date:</strong> ${new Date(record.testDate).toLocaleDateString()}</p>
                                <p><strong>Booklet Code:</strong> ${record.testBookletCode}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Performance Metrics</h6>
                                <p><strong>Total Questions:</strong> ${record.totalQuestions}</p>
                                <p><strong>Total Marks:</strong> ${record.totalMarks}</p>
                                <p><strong>Marks Obtained:</strong> ${record.marksObtained} (${percentage}%)</p>
                                <p><strong>Correct:</strong> ${record.correctQuestions}</p>
                                <p><strong>Incorrect:</strong> ${record.incorrectQuestions}</p>
                                <p><strong>Unattempted:</strong> ${record.unattemptedQuestions}</p>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>Review &amp; Feedback</h6>
                                <p><strong>Rating:</strong> ${record.rating}/10</p>
                                <p><strong>Remarks:</strong> ${record.remarks || 'No remarks provided'}</p>
                                <p><strong>Submitted:</strong> ${new Date(record.submittedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // CSV Export
    exportToCSV() {
        if (this.testRecords.length === 0) {
            this.showWarning('No records to export.');
            return;
        }

        const headers = [
            'Date', 'Coaching Institute', 'Subject', 'Chapter', 'Test Date', 
            'Test Booklet Code', 'Total Questions', 'Total Marks', 'Marks Obtained',
            'Percentage (%)', 'Correct Questions', 'Incorrect Questions', 
            'Unattempted Questions', 'Rating (1-10)', 'Remarks', 'Submitted At'
        ];

        const csvContent = [
            headers.join(','),
            ...this.testRecords.map(record => {
                const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(2);
                return [
                    new Date(record.testDate).toLocaleDateString(),
                    record.coaching,
                    record.subject,
                    record.chapter,
                    record.testDate,
                    record.testBookletCode,
                    record.totalQuestions,
                    record.totalMarks,
                    record.marksObtained,
                    percentage,
                    record.correctQuestions,
                    record.incorrectQuestions,
                    record.unattemptedQuestions,
                    record.rating,
                    `"${record.remarks.replace(/"/g, '""')}"`, // Escape quotes
                    new Date(record.submittedAt).toLocaleString()
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `test_analysis_records_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Initialize the application
const app = new TestAnalysisApp();

// Make app globally available for inline event handlers
window.app = app;