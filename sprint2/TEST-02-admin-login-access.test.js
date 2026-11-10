// TEST-02: Test Administrator Login and Access
// Traces: FR-09, VFR-03 (admin access), VFR-04 (login validation), VFR-09 (session security)
const assert = require("node:assert/strict");
const test = require("node:test");
const auth = require("./FR-09-admin-login");
const { editQuestion } = require("./FR-11-edit-question");
const { deleteQuestion } = require("./FR-12-delete-question");
const { MESSAGES } = require("./admin-messages");

function sampleQuestions() {
    return [
        { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5"], correctAnswer: "4" },
        { id: 2, text: "Capital of France?", options: ["Paris", "Rome"], correctAnswer: "Paris" }
    ];
}

test.beforeEach(function () {
    auth.logout();
});

test("FR-09: admin logs in with valid credentials", async function () {
    const result = await auth.login("admin", "Admin@123");
    assert.equal(result.success, true);
    assert.equal(result.message, MESSAGES.LOGIN_SUCCESS);
    assert.ok(result.token);
    assert.equal(auth.isAuthenticated(result.token), true);
});

test("VFR-04: wrong password is rejected", async function () {
    const result = await auth.login("admin", "wrongpass");
    assert.equal(result.success, false);
    assert.equal(result.message, MESSAGES.LOGIN_INVALID);
    assert.equal(result.token, undefined);
});

test("VFR-04: unknown username is rejected", async function () {
    const result = await auth.login("notadmin", "Admin@123");
    assert.equal(result.success, false);
    assert.equal(result.message, MESSAGES.LOGIN_INVALID);
});

test("VFR-04: empty username or password is rejected", async function () {
    assert.equal((await auth.login("", "Admin@123")).message, MESSAGES.LOGIN_REQUIRED_FIELDS);
    assert.equal((await auth.login("admin", "")).message, MESSAGES.LOGIN_REQUIRED_FIELDS);
    assert.equal((await auth.login("   ", "x")).message, MESSAGES.LOGIN_REQUIRED_FIELDS);
});

test("VFR-04: password is stored as a hash, not plain text", async function () {
    const hash = await auth.hashPassword("Admin@123");
    assert.notEqual(hash, "Admin@123");
    assert.equal(hash.length, 64);
});

test("VFR-03: edit is blocked without login", function () {
    const questions = sampleQuestions();
    assert.throws(
        function () { editQuestion(questions, null, 1, { text: "Changed" }); },
        { message: MESSAGES.NOT_AUTHENTICATED }
    );
    assert.equal(questions[0].text, "What is 2 + 2?");
});

test("VFR-03: delete is blocked without login", function () {
    const questions = sampleQuestions();
    assert.throws(
        function () { deleteQuestion(questions, null, 1); },
        { message: MESSAGES.NOT_AUTHENTICATED }
    );
    assert.equal(questions.length, 2);
});

test("VFR-09: a fake token cannot access admin functions", async function () {
    await auth.login("admin", "Admin@123");
    const questions = sampleQuestions();
    assert.throws(
        function () { deleteQuestion(questions, "fake-token", 1); },
        { message: MESSAGES.NOT_AUTHENTICATED }
    );
    assert.equal(questions.length, 2);
});

test("VFR-09: token stops working after logout", async function () {
    const { token } = await auth.login("admin", "Admin@123");
    auth.logout();
    assert.equal(auth.isAuthenticated(token), false);
    assert.throws(
        function () { deleteQuestion(sampleQuestions(), token, 1); },
        { message: MESSAGES.NOT_AUTHENTICATED }
    );
});

test("VFR-09: expired session is rejected", async function () {
    const { token } = await auth.login("admin", "Admin@123");
    auth._expireSessionForTest();
    assert.throws(
        function () { editQuestion(sampleQuestions(), token, 1, { text: "Changed" }); },
        { message: MESSAGES.SESSION_EXPIRED }
    );
    assert.equal(auth.isAuthenticated(token), false);
});

test("Integration: login -> edit -> delete -> view list", async function () {
    const questions = sampleQuestions();
    const { token } = await auth.login("admin", "Admin@123");

    const edited = editQuestion(questions, token, 1, {
        text: "What is 3 + 3?", options: ["5", "6", "7"], correctAnswer: "6"
    });
    assert.equal(edited.success, true);
    assert.deepEqual(questions[0], { id: 1, text: "What is 3 + 3?", options: ["5", "6", "7"], correctAnswer: "6" });

    const deleted = deleteQuestion(questions, token, 2);
    assert.equal(deleted.success, true);
    assert.deepEqual(questions.map(function (q) { return q.id; }), [1]);
});
