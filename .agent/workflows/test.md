---
description: How to test the application correctly
---

# Testing Workflow

To verify changes in the browser, follow these steps:

1. **Verify Dev Server**: Ensure the dev server is running on port `6969`.
2. **Navigate**: Use the `open_browser_url` or `navigate_page` tools to visit `http://localhost:6969`.
3. **Common Routes**:
   - Home: `http://localhost:6969/`
   - Onboarding: `http://localhost:6969/#NewGame`
   - Market: `http://localhost:6969/#Market` (requires game start)

// turbo
4. **Automated Check**: If unsure, run `grep '"dev":' package.json` to confirm the port.
