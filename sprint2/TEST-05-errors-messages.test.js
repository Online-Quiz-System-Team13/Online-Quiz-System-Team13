// TEST-05: Handle Errors and Display Messages
// Traces: VFR-10 (suitable error message for invalid data or invalid operations)
// Also covers FR-11 and FR-12 behaviour.
const assert = require("node:assert/strict");
const test = require("node:test");
const auth = require("./FR-09-admin-login");
const { editQuestion } = require("./FR-11-edit-question");
const { deleteQuestion } = require("./FR-12-delete-question");
const { MESSAGES, AdminError, toUserMessage } = require("./admin-messages");

let token;

function sampleQuestions() {
    return [
        { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5"], correctAnswer: "4" },
        { id: 2, text: "Capital of France?", options: ["Paris", "Rome"], correctAnswer: "Paris" }
    ];
}

test.beforeEach(async function () {
    token = (await auth.login("admin", "Admin@123")).token;
});

// ---------- FR-11: Edit Question ----------

test("FR-11: edits question text and keeps the same id", function () {
    const questions = sampleQuestions();
    const result = editQuestion(questions, token, 1, { text: "  What is 5 + 5?  " });
    assert.equal(result.message, MESSAGES.EDIT_SUCCESS);
    assert.equal(questions[0].id, 1);
    assert.equal(questions[0].text, "What is 5 + 5?");
    assert.equal(questions[0].correctAnswer, "4");
});

test("FR-11: edits options and correct answer together", function () {
    const questions = sampleQuestions();
    editQuestion(questions, token, 2, { options: ["Paris", "Berlin", "Rome"], correctAnswer: "Paris" });
    assert.deepEqual(questions[1].options, ["Paris", "Berlin", "Rome"]);
});

test("FR-11: works when the id is given as a string (from a form)", function () {
    const questions = sampleQuestions();
    editQuestion(questions, token, "2", { text: "Capital city of France?" });
    assert.equal(questions[1].text, "Capital city of France?");
    assert.equal(questions[1].id, 2);
});

// ---------- VFR-10: error messages for edit ----------

test("VFR-10: editing a question that does not exist", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 99, { text: "x" }); },
        { message: MESSAGES.QUESTION_NOT_FOUND });
});

test("VFR-10: missing question id", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, "", { text: "x" }); },
        { message: MESSAGES.QUESTION_ID_REQUIRED });
});

test("VFR-10: empty question text", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { text: "   " }); },
        { message: MESSAGES.QUESTION_TEXT_REQUIRED });
});

test("VFR-10: fewer than 2 options", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { options: ["4"], correctAnswer: "4" }); },
        { message: MESSAGES.OPTIONS_INVALID });
});

test("VFR-10: empty option", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { options: ["4", " "], correctAnswer: "4" }); },
        { message: MESSAGES.OPTION_EMPTY });
});

test("VFR-10: duplicate options", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { options: ["4", "4"], correctAnswer: "4" }); },
        { message: MESSAGES.OPTIONS_DUPLICATE });
});

test("VFR-10: correct answer not in options", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { correctAnswer: "10" }); },
        { message: MESSAGES.CORRECT_ANSWER_INVALID });
});

test("VFR-10: changing the id is not allowed", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, { id: 5 }); },
        { message: MESSAGES.ID_CHANGE_NOT_ALLOWED });
});

test("VFR-10: no changes provided", function () {
    assert.throws(function () { editQuestion(sampleQuestions(), token, 1, {}); },
        { message: MESSAGES.NO_CHANGES });
});

test("VFR-10: invalid edit does not change the stored question", function () {
    const questions = sampleQuestions();
    const before = JSON.stringify(questions);
    assert.throws(function () { editQuestion(questions, token, 1, { text: "New", correctAnswer: "nope" }); });
    assert.equal(JSON.stringify(questions), before);
});

// ---------- FR-12: Delete Question ----------

test("FR-12: deletes a question and keeps other ids unchanged", function () {
    const questions = sampleQuestions();
    const result = deleteQuestion(questions, token, 1);
    assert.equal(result.message, MESSAGES.DELETE_SUCCESS);
    assert.equal(result.question.id, 1);
    assert.deepEqual(questions, [{ id: 2, text: "Capital of France?", options: ["Paris", "Rome"], correctAnswer: "Paris" }]);
});

test("VFR-10: deleting a question that does not exist", function () {
    const questions = sampleQuestions();
    assert.throws(function () { deleteQuestion(questions, token, 42); },
        { message: MESSAGES.QUESTION_NOT_FOUND });
    assert.equal(questions.length, 2);
});

test("VFR-10: deleting the same question twice", function () {
    const questions = sampleQuestions();
    deleteQuestion(questions, token, 1);
    assert.throws(function () { deleteQuestion(questions, token, 1); },
        { message: MESSAGES.QUESTION_NOT_FOUND });
});

test("VFR-10: question list missing", function () {
    assert.throws(function () { deleteQuestion(null, token, 1); },
        { message: MESSAGES.QUESTION_LIST_INVALID });
});

// ---------- Message helper ----------

test("VFR-10: known errors show their message, unknown errors show a safe message", function () {
    assert.equal(toUserMessage(new AdminError("QUESTION_NOT_FOUND")), MESSAGES.QUESTION_NOT_FOUND);
    assert.equal(toUserMessage(new Error("internal stack details")), "Something went wrong. Please try again.");
});

// ---------- Integration with scoring format ----------

test("Integration: edited question still scores with the shared answer format", function () {
    const questions = sampleQuestions();
    editQuestion(questions, token, 1, { options: ["8", "9"], correctAnswer: "9" });
    const answers = { 1: "9", 2: "Paris" };
    const correct = questions.filter(function (q) { return answers[q.id] === q.correctAnswer; }).length;
    assert.equal(correct, 2);
});
