# Project Color — Requirements Document

**Version:** 0.2 (Draft)
**Date:** September 9, 2026
**Prepared for:** Alpha Lee
**Status:** Draft — pending answers to open questions in Section 8

---

## 1. Executive Summary

Project Color is a web-based color vision testing application. It guides a user through a short battery of validated color-vision screening tests and returns an assessment of whether they have a color vision deficiency and, if so, which type.

**Tech stack:** Angular v22 (frontend), .NET Core 10 (backend).

The backend is built as a versioned REST API from the start — covering test configuration, plate/color asset delivery, and scoring endpoints — even though the MVP is stateless and does not persist anything to a database. This avoids a rearchitecture when accounts and result storage are added post-MVP.

**Platform target (MVP):** Desktop web browsers only (latest Chrome, Edge, Firefox, Safari). Color rendering is far more predictable on desktop displays than on phones, and consistent color rendering is core to the product's validity, so mobile/responsive support is explicitly deferred.

---

## 2. Project Description

Project Color lets a person take a short, guided color vision screening test in their browser and, at the end, see a plain-language result: whether a color vision deficiency was detected, and if so, which specific type (e.g., Protanomaly vs. Protanopia vs. Deuteranomaly). No account is required and no results are stored server-side in the MVP — the session is self-contained from landing page to result.

## 3. Customer Need

Existing consumer-facing color vision tools and the corrective products built on them (glasses, lenses, apps) tend to treat "colorblindness" as one broad condition rather than diagnosing the specific type and severity a person has. As a result, people don't get guidance or correction targeted to their actual deficiency. Project Color's goal is to produce a more specific, individualized diagnosis than a simple pass/fail Arrangement check.

## 4. Goals for MVP

- Let a user complete a short screening (Arrangement-style + anomaloscope-style tests) in one uninterrupted browser session.
- Classify the result against the full clinical spectrum of color vision deficiencies (not just "colorblind: yes/no").
- Keep the experience account-free and storage-free, so there's no signup friction and no server-side handling of health-adjacent data.
- Let the user leave the session with something to keep (an exportable copy of their result).

---

## 5. In Scope (MVP)

### 5.1 Dashboard (Landing Page)

The application's entry point.

| Requirement # | Short Description      | Long Description                                                              |
| ------------- | ---------------------- | ----------------------------------------------------------------------------- |
| FR-1.1        | App overview           | Display an overview of the app and its purpose.                               |
| FR-1.2        | Start Test entry point | Provide a clear entry point ("Start Test") into the test flow.                |
| FR-1.3        | No account gate        | No login/account gate — the dashboard is reachable and usable by any visitor. |

### 5.2 Test Landing Page

Shown after the user chooses to start, before the first test question.

| Requirement # | Short Description    | Long Description                                                                                                                                                                                 |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-2.1        | Test info            | Present information about what the test involves and how long it takes.                                                                                                                          |
| FR-2.2        | Calibration guidance | Present display calibration guidance so the user's monitor is in a reasonable state before a color-accuracy-dependent test begins (see Open Question 8.4 for how prescriptive this needs to be). |
| FR-2.3        | Confirm before start | Require explicit user confirmation/acknowledgment before proceeding into the test battery.                                                                                                       |

### 5.3 Arrangement-Style Dot Test

| Requirement # | Short Description          | Long Description                                                                                                      |
| ------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| FR-3.1        | Pseudo-isochromatic plates | Present a series of pseudo-isochromatic ("dot") plates, each with a shape/number embedded in a field of colored dots. |
| FR-3.2        | Randomized plate order     | Randomize plate presentation order each time the test is taken.                                                       |
| FR-3.3        | Capture responses          | Capture the user's response to each plate (what they perceive, or "nothing/can't tell").                              |
| FR-3.4        | Feed into analysis         | Feed per-plate responses into the result analysis (Section 5.5).                                                      |

_See Open Question 8.1 regarding plate count, source, and licensing, and 8.2 regarding scoring thresholds._

### 5.4 Anomaloscope Test

A color-matching test styled after a clinical anomaloscope.

| Requirement # | Short Description              | Long Description                                                                                                                           |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-4.1        | Target color display           | Display a target color in the top-middle of the screen, drawn from a set of specific test colors chosen to differentiate deficiency types. |
| FR-4.1.1      | Saturation adjustment (target) | Target colors are defined with adjustable saturation.                                                                                      |
| FR-4.1.2      | Intensity adjustment (target)  | Target colors are defined with adjustable intensity.                                                                                       |
| FR-4.2        | User-adjustable circle         | Display a second, user-adjustable circle in the bottom-middle of the screen.                                                               |
| FR-4.3        | Match controls                 | Let the user adjust the bottom circle's color (via saturation/intensity controls) to try to match it to the top circle.                    |
| FR-4.4        | Submit match                   | Let the user submit their best match when satisfied.                                                                                       |
| FR-4.5        | Record match delta             | Record the delta between the user's submitted match and the true target for each trial, across enough trials to feed the result analysis.  |

_See Open Question 8.3 regarding which color axis/axes are tested, matching tolerance, and how match data maps to a diagnosis._

### 5.5 Test Result Analysis

Combines Arrangement and anomaloscope data into a final result.

| Requirement # | Short Description          | Long Description                                                                                                                                                                                                   |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-5.1        | Yes/No result              | Report a top-line Yes/No: does the user show a color vision deficiency.                                                                                                                                            |
| FR-5.2        | Deficiency classification  | If Yes, report a specific classification: Normal Trichromacy; Anomalous Trichromacy (Protanomaly, Deuteranomaly, Tritanomaly); Dichromacy (Protanopia, Deuteranopia, Tritanopia); or Monochromacy (Achromatopsia). |
| FR-5.3        | Plain-language explanation | Present the result in plain language, not just a clinical label (a short explanation of what the label means).                                                                                                     |
| FR-5.4        | PDF/image export           | Let the user export their result as a PDF or image, generated client-side, so they have something to keep even though nothing is stored server-side.                                                               |

_See Open Question 8.3 for how raw test data is scored into these specific categories._

---

## 6. Out of Scope for MVP

- **Farnsworth test** (e.g., Farnsworth D-15) — not included in this release.
- **Server-side storage of results** — nothing about a user's session or results is persisted in a database.
- **Account creation** — no signup, login, or user profiles.
- **Test time limits** — the user can take as long as they want on any screen.
  Because the backend is being built as a full API from the start (per Section 1), it's worth being explicit that "no storage" is a product decision for MVP, not a technical limitation — the API is structured so accounts and persistence can be added later without a rewrite.

---

## 7. Non-Functional Requirements

- **Browser support:** Latest stable versions of Chrome, Edge, Firefox, and Safari on desktop/laptop. No mobile or tablet support in MVP.
- **Color rendering:** The app assumes a standard sRGB display and does not perform display color-profile detection or correction; guidance to the user is limited to what's described in Section 5.2 / Open Question 8.4.
- **Privacy:** Since results are not stored server-side and there is no account system, the app should avoid sending identifying information alongside test data to the backend. Result export (FR-5.4) happens client-side.
- **Accessibility:** General UI (navigation, buttons, instructional text) should not rely on color alone to convey meaning, given the target audience for this app is disproportionately likely to have a color vision deficiency. This applies to the app's chrome, not to the test plates themselves, which are color-dependent by design.
- **Performance:** Test plate and color assets should load quickly enough that network latency doesn't interfere with a color-perception task (e.g., no visible flash/pop-in of a plate's true colors while loading).

---

## 8. Open Questions / Assumptions

These weren't fully specified and need an answer before implementation starts. Where noted, an assumption is stated so work isn't blocked — flag if the assumption is wrong.

1. **Arrangement plate set — source and count.** Genuine Arrangement plates are copyrighted (Kanehara & Co.). We'll need either a licensed plate set or a freely-licensed/generated pseudo-isochromatic plate set styled after Arrangement's method. How many plates should the MVP use (the clinical standard ranges from 14–38 depending on the edition), and what's the source/licensing plan?
2. **Arrangement scoring threshold.** What number/pattern of missed plates constitutes a "fail" and feeds into which deficiency category? (Clinically this is usually a specific miss-count per plate type, e.g., red-green–sensitive vs. control plates.)
3. **Anomaloscope color axis and scoring.** A clinical anomaloscope (Rayleigh match) tests the red-green axis by mixing red and green light to match a fixed yellow; a separate (Moreland) match tests the blue-yellow axis. Project Color's description — one target color, adjusted by saturation and intensity — is a simplified variant. To classify all 8 categories in Section 5.5 (including tritan and monochromacy), the test likely needs multiple target colors spanning both axes. Should FR-4.1 include a defined set of target colors covering red-green and blue-yellow axes? What match tolerance separates "matched" (trichromat), "anomalous" (matched but with a shifted/widened range), and "matched almost anything" (dichromat/monochromat)?
4. **Calibration rules — how enforced.** Is FR-2.2 purely instructional text (brightness, disable blue-light filters, dim ambient light — user self-attests), or does it require an interactive step (e.g., a calibration image the user must confirm looks correct) before the test can proceed?
5. **Retake behavior.** If a user finishes or abandons a test, can they restart from the dashboard? Since nothing is stored, is a partial retake (e.g., anomaloscope only) supported, or is it always the full battery?
6. **Localization.** Is English-only acceptable for MVP?
7. **"Best of" vs. single attempt.** For the anomaloscope test, is each color matched once, or does the user get multiple attempts/trials per color that get averaged?

---

## 9. Glossary

| Term                         | Meaning                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Trichromacy                  | Normal color vision; all three cone types (L, M, S) functioning typically.                                         |
| Anomalous Trichromacy        | All three cone types present but one has a shifted sensitivity, causing reduced (not absent) color discrimination. |
| Protanomaly                  | Anomalous trichromacy affecting the L (red-sensitive) cone.                                                        |
| Deuteranomaly                | Anomalous trichromacy affecting the M (green-sensitive) cone); the most common color vision deficiency.            |
| Tritanomaly                  | Anomalous trichromacy affecting the S (blue-sensitive) cone; rare.                                                 |
| Dichromacy                   | Only two of the three cone types are functional; one is entirely missing.                                          |
| Protanopia                   | Dichromacy with no functioning L (red) cones.                                                                      |
| Deuteranopia                 | Dichromacy with no functioning M (green) cones.                                                                    |
| Tritanopia                   | Dichromacy with no functioning S (blue) cones; rare.                                                               |
| Monochromacy (Achromatopsia) | One or zero functioning cone types; little to no color discrimination. Rare.                                       |

---

_Next step: resolve Section 8's open questions, then this document can move from Draft to a version ready for sprint planning / ticket breakdown._
