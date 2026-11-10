const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const QuestionBank = require("../js/question-bank");
const { getNavigationState } = require("../sprint1/FR-04-navigate-questions");
const AdminAuth = require("./FR-09-admin-login");
const { addQuestion } = require("./FR-10-add-question");
const AdminEditQuestion = require("./FR-11-edit-question");
const AdminDeleteQuestion = require("./FR-12-delete-question");

const root = path.join(__dirname, "..");
const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const adminHtml = fs.readFileSync(path.join(__dirname, "admin.html"), "utf8");

function createStorage() {
    const values = new Map();
    return {
        getItem: function (key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem: function (key, value) {
            values.set(key, value);
        }
    };
}

test("home page clearly links to the quiz and administrator tools", function () {
    assert.match(homeHtml, /id="start-button"[^>]*>Start quiz<\/button>/);
    assert.match(homeHtml, /href="\.\/sprint2\/admin\.html"[\s\S]*?Administrator tools/);
});

test("quiz and admin forms have labeled controls and load their feature scripts", function () {
    for (const [html, ids] of [
        [homeHtml, ["question-container", "submit-button", "exit-container"]],
        [adminHtml, ["login-form", "username", "password", "add-form", "add-text", "add-options", "add-correct", "edit-form", "logout-button"]]
    ]) {
        for (const id of ids) {
            assert.match(html, new RegExp(`id="${id}"`), `Expected ${id} in page markup`);
        }
    }

    for (const inputId of ["username", "password", "add-text", "add-options", "add-correct"]) {
        assert.match(adminHtml, new RegExp(`<label for="${inputId}">`), `${inputId} should have a label`);
    }

    for (const file of [
        "admin-messages.js",
        "FR-09-admin-login.js",
        "FR-10-add-question.js",
        "FR-11-edit-question.js",
        "FR-12-delete-question.js",
        "FR-13-view-questions.js",
        "../js/question-bank.js"
    ]) {
        assert.ok(adminHtml.includes(`src="${file}"`), `Admin page should load ${file}`);
    }
});

test("quiz navigation exposes clear answered status and respects both boundaries", function () {
    const questions = QuestionBank.DEFAULT_QUESTIONS.slice(0, 3);
    const first = getNavigationState(questions, { 1: "A" }, 0);
    assert.equal(first.canGoPrevious, false);
    assert.equal(first.canGoNext, true);
    assert.equal(first.questions[0].isAnswered, true);
    assert.equal(first.questions[1].isAnswered, false);

    const last = getNavigationState(questions, {}, questions.length - 1);
    assert.equal(last.canGoPrevious, true);
    assert.equal(last.canGoNext, false);
});

test("admin add, edit, and delete actions are reflected in the participant question bank", async function () {
    const storage = createStorage();
    let questions = QuestionBank.load(storage);
    const login = await AdminAuth.login("admin", "Admin@123");
    assert.equal(login.success, true);

    const adminQuestions = QuestionBank.toAdminQuestions(questions);
    const editable = adminQuestions[0];
    AdminEditQuestion.editQuestion(adminQuestions, login.token, editable.id, {
        text: "Usability test: edited shared question",
        options: editable.options,
        correctAnswer: editable.correctAnswer
    });
    questions = QuestionBank.fromAdminQuestions(adminQuestions, questions);
    QuestionBank.save(storage, questions);

    const optionValues = [
        { value: "A", label: "First choice" },
        { value: "B", label: "Second choice" }
    ];
    addQuestion(questions, {
        id: 100,
        text: "Usability test: temporary shared question",
        options: optionValues,
        correctAnswer: "B"
    });
    QuestionBank.save(storage, questions);

    let participantQuestions = QuestionBank.load(storage);
    assert.ok(participantQuestions.some(function (question) {
        return question.text === "Usability test: edited shared question";
    }));
    assert.ok(participantQuestions.some(function (question) {
        return question.text === "Usability test: temporary shared question";
    }));

    AdminDeleteQuestion.deleteQuestion(participantQuestions, login.token, 100);
    QuestionBank.save(storage, participantQuestions);
    AdminAuth.logout();

    participantQuestions = QuestionBank.load(storage);
    assert.equal(participantQuestions.some(function (question) {
        return question.id === 100;
    }), false);
});
