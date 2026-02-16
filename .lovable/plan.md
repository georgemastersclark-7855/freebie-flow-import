
## Move Rob's Credits Ticker Below His Signature

Currently the credits ticker (album art carousel) sits near the top of the page, right after the mini social proof section. We'll relocate it to appear directly after Rob's signature at the end of his story section.

### What changes

**File:** `src/pages/TheProducerBlueprint005Workflow.tsx`

1. **Cut** the entire credits ticker block (lines 1074-1178) from its current position above `</main>`
2. **Paste** it immediately after the signature block (after line 1630), inside the story section but before the `</div></section>` closing tags
3. Add appropriate top margin (e.g. `mt-24 md:mt-32`) so it flows naturally after the signature
4. No other files or sections are modified

### Layout result

```
Story timeline content
  -> Quote & "Priceless"
  -> Signature image
  -> ROB LATE CREDITS ticker (moved here)
Curriculum section
Wall of Wins section
...
```

Only the 005Workflow variant is affected. The ticker markup stays identical -- just repositioned.
