# Responsive & Cross-Device QA — Needs Owner Verification

While all automated assertions across the 17-viewport matrix, breakpoint sweeps, and environmental conditions have passed in headless Chromium, certain hardware- and OS-level behaviors require verification on physical devices by the site owner or QA lead.

---

## 1. Physical Device Checklist

### A. Real Apple iPhone (iOS Safari 16, 17, or 18)
- [ ] **Native Tap-to-Call Prompt**:
  - Open `https://phoenixvalleyplumber.com/` on iPhone Safari.
  - Tap the orange **"Call Now · (602) 835-0102"** sticky bar at the bottom.
  - Verify that the native iOS prompt appears (`Call (602) 835-0102` / `Cancel`) without lag or delay.
- [ ] **No Form Auto-Zoom**:
  - Navigate to `/contact/`.
  - Tap into each form field (Name, Phone, Email, Service dropdown, City/ZIP, Message).
  - Confirm that Safari does **not** zoom in automatically (all inputs and checkboxes now have `font-size: 16px` explicitly set).
- [ ] **Safari Bottom Tab Bar & Home Indicator**:
  - Scroll down any page (e.g., `/water-heater-repair/`).
  - Verify that the sticky call bar sits cleanly above the iOS home indicator bar and does not get occluded by the translucent Safari navigation bar.
- [ ] **Landscape Notch & Dynamic Island**:
  - Rotate the iPhone to landscape orientation (`667x375` or `844x390`).
  - Verify that left/right padding accounts for `env(safe-area-inset-left)` and `env(safe-area-inset-right)` so headings and logos are not clipped behind the camera cut-out.

---

### B. Real Android Device (Chrome on Android 13/14/15)
- [ ] **Native Dialer Intent**:
  - Tap the Call button on the homepage hero and sticky call bar.
  - Verify Android immediately triggers the default Phone / Dialer app with `(602) 835-0102` pre-filled.
- [ ] **Virtual Keyboard Occlusion on Contact Form**:
  - Navigate to `/contact/` and tap into the "Message" textarea.
  - When the Gboard / Samsung keyboard pops up, verify the active textarea scrolls smoothly into view and is not covered by the sticky bar.

---

### C. Apple iPad (iPadOS 16/17/18)
- [ ] **Split View & Slide Over Multi-Tasking**:
  - Open Safari in Split View (1/3 screen width, approx. 320px–375px wide).
  - Confirm the page automatically transitions into the mobile single-column layout with the hamburger menu.
  - Expand to 2/3 and Full Screen; confirm the desktop mega-menu and floating call pill take over gracefully.

---

## 2. Owner Decisions & Recommendations

1. **Virtual Keyboard Handling**:
   - In automated testing, the sticky call bar remains fixed at the bottom. On Android Chrome, the viewport shrinks (`100dvh`), which pushes fixed bottom bars up above the keyboard unless dismissed. The contact form fields scroll cleanly, but if the owner prefers, we can optionally hide the sticky call bar when any `<input>` or `<textarea>` is focused.
2. **Google Maps Interactive Overlay**:
   - The embedded Google Map in the footer has `loading="lazy"`. On mobile touch devices, scrolling through the footer across the map container works smoothly without trapping the touch gesture. No further changes needed.
