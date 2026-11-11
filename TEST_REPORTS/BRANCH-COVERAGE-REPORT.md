# Branch Coverage Report

## Summary

| Item | Result |
|---|---:|
| Overall branch coverage | **80.54%** |
| Test result | **69 passed, 0 failed** |
| Coverage engine | Node.js built-in V8 test coverage |
| Runtime | Node.js v24.9.0 |
| Execution date | 11 November 2026 |

## Branch coverage by source file

| Source file | Branch coverage |
|---|---:|
| `js/question-bank.js` | 65.71% |
| `js/quiz.js` | 100.00% |
| `sprint1/FR-01-start-quiz.js` | 87.50% |
| `sprint1/FR-02-display-questions.js` | 73.91% |
| `sprint1/FR-03-select-answer.js` | 66.67% |
| `sprint1/FR-04-navigate-questions.js` | 76.92% |
| `sprint1/FR-08-exit-quiz.js` | 88.89% |
| `sprint2/admin-messages.js` | 75.00% |
| `sprint2/FR-09-admin-login.js` | 84.38% |
| `sprint2/FR-10-add-question.js` | 88.46% |
| `sprint2/FR-11-edit-question.js` | 91.11% |
| `sprint2/FR-12-delete-question.js` | 50.00% |
| `sprint2/FR-13-view-questions.js` | 71.43% |
| **All instrumented files** | **80.54%** |

## Notes

- Branches are reported by V8 for the instrumented JavaScript modules, using the same full-suite run as the code coverage report.
- Lower values identify conditional paths not executed during this run; they are not automatically test failures.
- `FR-12-delete-question.js` has 50% branch coverage despite 100% line coverage. Add tests for remaining conditional outcomes if a higher branch-coverage target is required.
- Inline page scripts and browser-only event-handling branches are not instrumented by this Node coverage run.
