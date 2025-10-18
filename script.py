
# Read the complete HTML file to understand the structure
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Print first 5000 characters to see the structure
print("HTML Structure (first 5000 chars):")
print(html_content[:5000])
print("\n" + "="*80 + "\n")

# Read the complete JS file
with open('app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Print first 3000 characters of JS
print("JavaScript Structure (first 3000 chars):")
print(js_content[:3000])
