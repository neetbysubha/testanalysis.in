
# Save the modified JavaScript file
with open('app_modified.js', 'w', encoding='utf-8') as f:
    f.write(modified_js)

print("JavaScript file saved as 'app_modified.js'")

# Now read and analyze the HTML to add the PDF export button
with open('index.html', 'r', encoding='utf-8') as f:
    html_full = f.read()

# Check if there's an export button
if 'exportBtn' in html_full:
    print("\nFound existing export button in HTML")
    
# Let's see where to add the PDF button
print("\nSearching for export button location...")
export_btn_idx = html_full.find('id="exportBtn"')
if export_btn_idx != -1:
    print(f"Export button found at index: {export_btn_idx}")
    # Show context around it
    context_start = max(0, export_btn_idx - 200)
    context_end = min(len(html_full), export_btn_idx + 300)
    print("\nContext:")
    print(html_full[context_start:context_end])
