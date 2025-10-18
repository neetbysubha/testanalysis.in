
# Now create the modified HTML with the PDF export button added
# Read the original HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the export button section to include both CSV and PDF buttons
# Find and replace the export button
old_export_section = '''<button id="exportBtn" class="btn btn-success">
                                <i class="fas fa-download me-2"></i>Export CSV
                            </button>'''

new_export_section = '''<div class="btn-group">
                                <button id="exportBtn" class="btn btn-success">
                                    <i class="fas fa-file-excel me-2"></i>Export Excel
                                </button>
                                <button id="exportPdfBtn" class="btn btn-danger">
                                    <i class="fas fa-file-pdf me-2"></i>Export PDF
                                </button>
                            </div>'''

html_modified = html_content.replace(old_export_section, new_export_section)

# Also change the script reference to the modified JS file
html_modified = html_modified.replace('src="app.js"', 'src="app_modified.js"')

# Make background whitish - update the body background in the HTML if needed
# The CSS already has a cream/whitish background, but let's ensure it's applied

print("Modified HTML created")
print(f"Original HTML length: {len(html_content)}")
print(f"Modified HTML length: {len(html_modified)}")
