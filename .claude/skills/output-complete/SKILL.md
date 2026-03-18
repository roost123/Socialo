---
name: output-complete
description: Ensures complete, production-ready output without shortcuts or placeholders
---

# Full-Output Enforcement

When generating code, deliver complete, production-ready output. No shortcuts.

## Banned Patterns

**In code blocks, NEVER output:**
- `// ...`
- `// rest of code`
- `// TODO`
- `/* ... */`
- `// similar to above`
- Bare ellipses replacing actual logic
- Single examples representing repeated patterns

**In prose, NEVER say:**
- "Let me know if you want me to continue"
- "For brevity..."
- "And so on..."
- "Similar to the above..."

## Process

1. Determine exact deliverable count from the request
2. Generate ALL items completely
3. Verify nothing is missing before responding

## Token Limit Handling

If approaching capacity, end at a natural boundary with a note like:
`[Pausing here — completed sections 1-3, will continue with section 4]`

Then resume without recapping when prompted.

## Validation Checklist

Before submitting, verify:
- [ ] No banned placeholder patterns present
- [ ] All requested items are complete
- [ ] Code is executable, not descriptive
- [ ] No sections compressed to save space
