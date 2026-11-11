# System Validation Report

## Execution summary

| Item | Result |
|---|---|
| Project | Online Quiz System — Sprint 1 participant quiz and Sprint 2 administrator tools |
| Execution date | 11 November 2026 |
| Validation basis | Existing Sprint 1/Sprint 2 test cases and automated shared-question-bank usability checks |
| Outcome | **PASS for automated validation — 69 tests, 0 failures** |
| Manual first-time-user usability session | **NOT RUN** |

No separate formal Test Plan file was present in the repository. This report maps the automated tests available in the repository to the implemented functional requirements. The requested 2–6 November 2026 window is documented as the planned period; the recorded execution for this report occurred on 11 November and is not backdated.

## Functional validation

| Requirement | Validation evidence | Status |
|---|---|---|
| FR-01 — Start quiz | Initializes quiz state; rejects absent/empty question input | PASS |
| FR-02 — Display questions | Displays first and subsequent questions; checks invalid index and inactive session | PASS |
| FR-03 — Select answer | Stores selected answers by question ID; integration tests verify persistence through navigation | PASS |
| FR-04 — Navigate questions | Current/answered state and previous/next boundaries are tested | PASS |
| FR-05 — Submit quiz | Submission status and unanswered-question count are tested | PASS |
| FR-06 — Calculate score | Correct, incorrect, unanswered, total, and score values are tested | PASS |
| FR-07 — Display result | Result output includes the expected final score | PASS |
| FR-08 — Exit quiz | Exit control rendering, confirmed exit, cancelled exit, and invalid input are tested | PASS |
| FR-09 — Administrator login/access | Valid/invalid credentials, empty fields, session expiry, logout, and protected access are tested | PASS |
| FR-10 — Add question | Valid question creation and invalid/duplicate input rejection are tested; shared bank integration is tested | PASS |
| FR-11 — Edit question | Valid edits, preserved IDs, invalid edits, and no-mutation-on-failure are tested | PASS |
| FR-12 — Delete question | Valid deletion, missing/repeated deletion, ID preservation, and authorization are tested | PASS |
| FR-13 — View questions | List rendering, custom cards, empty state, invalid data, and missing renderer are tested | PASS |
| Shared question bank | Admin edits, adds, and deletes are reloaded and verified in participant question data | PASS |

## System-level checks

- The TEST-06 automated checks verify that the home page links to the quiz/admin page, expected controls and input labels exist, and the admin page references its feature scripts.
- Shared-question-bank integration tests use a storage test double; they verify application data flow and persistence logic, not browser storage or a live multi-page browser session.
- TEST-07 exercises cloning question sets of 100, 1,000, and 5,000 items over 20 iterations. The observed averages during the report run were 0.055 ms, 0.730 ms, and 1.669 ms, respectively. The test defines no maximum-time threshold, so these are observations rather than a performance SLA.
- A first-time-user session assessing comprehension, visual clarity, and hesitation was not conducted. Complete the manual tasks in `sprint2/TEST-06-usability.md` and record results before claiming user-validated usability.

## Overall conclusion

All automated Sprint 1 and Sprint 2 functional/integration checks passed in the recorded run. Manual user validation remains outstanding. Because no standalone formal Test Plan was found, this conclusion is limited to the cases currently represented in the repository.
