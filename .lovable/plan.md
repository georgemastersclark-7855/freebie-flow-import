

## Plan: Producer Accelerator Waitlist Page (Typeform Version)

### Overview
Create a simple, high-converting waitlist landing page at `/produceraccellerator` for the 8-week small group mentorship program. The "Apply Now" button will link directly to an external Typeform, keeping the page simple and letting Typeform handle the application process.

---

### Page Structure

```text
+------------------------------------------+
|              Header (Logo)               |
+------------------------------------------+
|                                          |
|       Have Rob Late Mentor You           |
|   (8-week small group mentorship)        |
|                                          |
|   "I'm opening up places for the first   |
|    ever Producer Accelerator..."         |
|                                          |
+------------------------------------------+
|                                          |
|           What You Get:                  |
|   - Direct feedback on your music        |
|   - Weekly live calls (90 mins)          |
|   - Private WhatsApp group               |
|   - Limited to 15 people                 |
|                                          |
+------------------------------------------+
|                                          |
|   "Spaces are super limited..."          |
|                                          |
|   [   Apply Now   ] --> Opens Typeform   |
|                                          |
+------------------------------------------+
|              Footer                      |
+------------------------------------------+
```

---

### Design Specifications

| Element | Style |
|---------|-------|
| Background | `bg-black` (#050505) |
| Primary CTA | `bg-[#D3FF02]` with black text, opens Typeform in new tab |
| Card styling | `bg-gray-900/50 border-gray-700` with subtle glow |
| Typography | `font-zurich-condensed` for body, bold white for headlines |
| Icons | Lucide icons (Music, MessageCircle, Users, Video) for benefits |

---

### Technical Implementation

**Files to Create/Modify:**

1. **Create** `src/pages/ProducerAccelerator.tsx`
   - Static landing page component
   - No form fields needed
   - "Apply Now" button links to Typeform URL (placeholder until you provide actual URL)

2. **Edit** `src/App.tsx`
   - Add import for `ProducerAccelerator`
   - Add route: `/produceraccellerator`

**Button Implementation:**
```tsx
<a 
  href="https://your-typeform-url.typeform.com/to/xxxxx" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Button className="bg-[#D3FF02] text-black font-bold">
    Apply Now
  </Button>
</a>
```

---

### Copy

**Headline:** Have Rob Late Mentor You

**Subheadline:** 8-week small group mentorship for producers

**Body:**
I'm opening up places for the first ever Producer Accelerator.

15 producers get mentored directly by me for 8 weeks. I help you finish more music, improve your sound, and get clarity on what's actually holding you back in your music (and career).

**Benefits List:**
- Direct feedback on your music from me
- Weekly live calls (90 mins)
- Private WhatsApp group to ask questions
- Limited to 15 people

**CTA Context:** Spaces are super limited. Click to apply below.

**Button:** Apply Now

---

### Next Steps After Implementation
Once you have your Typeform created, just provide the URL and I'll update the button link.

