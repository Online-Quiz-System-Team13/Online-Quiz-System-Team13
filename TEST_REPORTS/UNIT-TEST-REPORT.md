# Unit Test Report

## Execution summary

| Item | Result |
|---|---|
| Project | Online Quiz System — Sprint 1 and Sprint 2 JavaScript implementation |
| Execution date | 11 November 2026 |
| Runtime | Node.js v24.9.0 |
| Command | `node --test --experimental-test-coverage js/quiz.test.js js/question-bank.test.js sprint1/FR-01-FR-02.test.js sprint1/FR-03-FR-04.test.js sprint1/FR-08-exit-quiz.test.js sprint2/FR-13-view-questions.test.js sprint2/TEST-02-admin-login-access.test.js sprint2/TEST-03-question-validation.test.js sprint2/TEST-05-errors-messages.test.js sprint2/TEST-06-usability.test.js sprint2/TEST-07-performance.test.js` |
| Outcome | **PASS — 69 tests, 0 failures** |

The legacy `js/quiz.test.js` is a script-style test file: its six scoring/submission/result checks ran successfully and its file-level Node test entry passed. The other ten files use `node:test`.

## Test results by area

| Test source | Area covered | Result |
|---|---|---|
| `js/quiz.test.js` | Submit answers, unanswered count, score calculation, empty quiz, and result text | PASS |
| `js/question-bank.test.js` | Default quiz questions, persistence, invalid stored data, and admin add/edit/delete sharing | PASS |
| `sprint1/FR-01-FR-02.test.js` | Start session, reject invalid start, display questions, preserve selected answers, reject invalid display states | PASS |
| `sprint1/FR-03-FR-04.test.js` | Store answers, report answered/current state, enforce navigation bounds | PASS |
| `sprint1/FR-08-exit-quiz.test.js` | Render exit control, confirm/cancel exit, reject invalid arguments | PASS |
| `sprint2/FR-13-view-questions.test.js` | Render question list, custom admin cards, empty state, renderer validation | PASS |
| `sprint2/TEST-02-admin-login-access.test.js` | Valid/invalid login, password hashing, access control, fake/logout/expired tokens, admin integration | PASS |
| `sprint2/TEST-03-question-validation.test.js` | Add valid questions and reject invalid IDs, text, options, duplicates, and correct answers | PASS |
| `sprint2/TEST-05-errors-messages.test.js` | Edit/delete behavior, validation errors, safe messages, scoring integration | PASS |
| `sprint2/TEST-06-usability.test.js` | Page controls and labels, navigation status/bounds, shared admin/participant question changes | PASS |
| `sprint2/TEST-07-performance.test.js` | Question-copy loading checks at 100, 1,000, and 5,000 questions | PASS |

## Scope and limitations

- Results reflect a fresh run on 11 November 2026. They are not evidence that the tests were executed during the requested 2–6 November window.
- The repository did not contain a separate formal Test Plan document; the Sprint 1/Sprint 2 test files, workflow commands, and `sprint2/TEST-06-usability.md` were used as the available plan.
- The automated suite is green. The manual first-time-user usability session is not an automated unit test and is still pending.
