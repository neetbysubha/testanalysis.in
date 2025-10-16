// enhanced-integration.js - Additional JavaScript for backend integration

class TestAnalysisAPI {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    async submitTest(formData) {
        try {
            const response = await fetch(`${this.baseURL}/submit_test.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            return await response.json();
        } catch (error) {
            console.error('Error submitting test:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async getData(page = 1, limit = 10, search = '', filters = {}) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search,
                ...filters
            });

            const response = await fetch(`${this.baseURL}/get_data.php?${params}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return { success: false, message: 'Failed to fetch data' };
        }
    }

    async getStatistics() {
        try {
            const response = await fetch(`${this.baseURL}/statistics.php`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return { success: false, message: 'Failed to fetch statistics' };
        }
    }

    downloadExcel() {
        window.open(`${this.baseURL}/export_excel.php`, '_blank');
    }
}

// Enhanced form validation
class FormValidator {
    static validateTestForm(formData) {
        const errors = [];

        // Required field validation
        const required = [
            'coaching_institute', 'subject', 'chapter', 'test_date',
            'test_booklet_code', 'total_questions', 'total_marks',
            'marks_obtained', 'total_correct_questions', 'total_incorrect_questions',
            'total_unattempted_questions', 'test_review', 'review_scale'
        ];

        required.forEach(field => {
            if (!formData[field] || formData[field] === '') {
                errors.push(`${field.replace('_', ' ').toUpperCase()} is required`);
            }
        });

        // Numeric validation
        const numericFields = [
            'total_questions', 'total_marks', 'marks_obtained',
            'total_correct_questions', 'total_incorrect_questions', 'total_unattempted_questions'
        ];

        numericFields.forEach(field => {
            const value = parseInt(formData[field]);
            if (isNaN(value) || value < 0) {
                errors.push(`${field.replace('_', ' ').toUpperCase()} must be a positive number`);
            }
        });

        // Logic validation
        const total = parseInt(formData.total_questions);
        const correct = parseInt(formData.total_correct_questions);
        const incorrect = parseInt(formData.total_incorrect_questions);
        const unattempted = parseInt(formData.total_unattempted_questions);

        if (correct + incorrect + unattempted !== total) {
            errors.push('Sum of correct, incorrect, and unattempted questions must equal total questions');
        }

        if (parseInt(formData.marks_obtained) > parseInt(formData.total_marks)) {
            errors.push('Marks obtained cannot exceed total marks');
        }

        // Date validation
        const testDate = new Date(formData.test_date);
        const today = new Date();
        if (testDate > today) {
            errors.push('Test date cannot be in the future');
        }

        // Review scale validation
        const reviewScale = parseInt(formData.review_scale);
        if (reviewScale < 1 || reviewScale > 10) {
            errors.push('Review scale must be between 1 and 10');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Performance calculations
class PerformanceCalculator {
    static calculateMetrics(testData) {
        const percentageScore = (testData.marks_obtained / testData.total_marks) * 100;
        const accuracyPercentage = (testData.total_correct_questions / testData.total_questions) * 100;
        const attemptedQuestions = testData.total_questions - testData.total_unattempted_questions;
        const attemptPercentage = (attemptedQuestions / testData.total_questions) * 100;

        return {
            percentage_score: Math.round(percentageScore * 100) / 100,
            accuracy_percentage: Math.round(accuracyPercentage * 100) / 100,
            attempt_percentage: Math.round(attemptPercentage * 100) / 100,
            attempted_questions: attemptedQuestions
        };
    }

    static getGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        return 'F';
    }
}

// Export this for use in the main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestAnalysisAPI, FormValidator, PerformanceCalculator };
} else if (typeof window !== 'undefined') {
    window.TestAnalysisAPI = TestAnalysisAPI;
    window.FormValidator = FormValidator;
    window.PerformanceCalculator = PerformanceCalculator;
}