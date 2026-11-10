const assert = require("node:assert/strict");
const test = require("node:test");
const QuestionBank = require("./question-bank");
const { addQuestion } = require("../sprint2/FR-10-add-question");
const AdminAuth = require("../sprint2/FR-09-admin-login");
const AdminEditQuestion = require("../sprint2/FR-11-edit-question");
const AdminDeleteQuestion = require("../sprint2/FR-12-delete-question");

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

test("both pages start from the participant quiz questions", function () {
    const storage = createStorage();
    const questions = QuestionBank.load(storage);

    assert.equal(questions.length, 5);
    assert.equal(questions[0].text, "Which planet is known as the Red Planet?");
    assert.equal(questions[0].options[1].label, "Mars");
    assert.equal(questions[0].correctAnswer, "B");
    assert.deepEqual(QuestionBank.load(storage), questions);
});

test("edits and deletions persist in the shared question bank", function () {
    const storage = createStorage();
    const questions = QuestionBank.load(storage);
    questions[0].text = "Which planet is called the Red Planet?";
    questions.splice(1, 1);

    QuestionBank.save(storage, questions);
    const reloaded = QuestionBank.load(storage);

    assert.equal(reloaded.length, 4);
    assert.equal(reloaded[0].text, "Which planet is called the Red Planet?");
    assert.equal(reloaded.some(function (question) { return question.id === 2; }), false);
});

test("admin edits and deletes the same questions used by the participant quiz", async function () {
    const storage = createStorage();
    const questions = QuestionBank.load(storage);
    const adminQuestions = QuestionBank.toAdminQuestions(questions);
    const login = await AdminAuth.login("admin", "Admin@123");

    assert.equal(login.success, true);
    AdminEditQuestion.editQuestion(adminQuestions, login.token, 1, {
        text: "Which planet is called the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correctAnswer: "Mars"
    });
    QuestionBank.save(storage, QuestionBank.fromAdminQuestions(adminQuestions, questions));

    AdminDeleteQuestion.deleteQuestion(adminQuestions, login.token, 2);
    QuestionBank.save(storage, QuestionBank.fromAdminQuestions(adminQuestions, questions));
    AdminAuth.logout();

    const participantQuestions = QuestionBank.load(storage);
    const editedQuestion = participantQuestions.find(function (question) {
        return question.id === 1;
    });
    assert.equal(editedQuestion.text, "Which planet is called the Red Planet?");
    assert.equal(
        editedQuestion.options.find(function (option) { return option.label === "Mars"; }).value,
        editedQuestion.correctAnswer
    );
    assert.equal(participantQuestions.some(function (question) { return question.id === 2; }), false);
    assert.equal(participantQuestions.length, 4);
});

test("admin adds a question that appears in the participant quiz", async function () {
    const storage = createStorage();
    const questions = QuestionBank.load(storage);
    const login = await AdminAuth.login("admin", "Admin@123");
    const updatedQuestions = QuestionBank.fromAdminQuestions(
        QuestionBank.toAdminQuestions(questions),
        questions
    );
    const options = [
        { value: "OPTION_1", label: "Pacific" },
        { value: "OPTION_2", label: "Atlantic" }
    ];

    addQuestion(updatedQuestions, {
        id: 6,
        text: "Which ocean is the largest?",
        options: options,
        correctAnswer: "OPTION_1"
    });
    QuestionBank.save(storage, updatedQuestions);
    AdminAuth.logout();

    const participantQuestions = QuestionBank.load(storage);
    const addedQuestion = participantQuestions.find(function (question) {
        return question.id === 6;
    });
    assert.ok(addedQuestion);
    assert.equal(addedQuestion.text, "Which ocean is the largest?");
    assert.equal(addedQuestion.options[0].label, "Pacific");
    assert.equal(addedQuestion.correctAnswer, addedQuestion.options[0].value);
    assert.equal(participantQuestions.length, 6);
});

test("invalid saved question data is reported instead of replaced silently", function () {
    const storage = createStorage();
    storage.setItem(QuestionBank.STORAGE_KEY, "{invalid json");

    assert.throws(function () {
        QuestionBank.load(storage);
    }, SyntaxError);
});

test("invalid changes cannot be saved to the shared question bank", function () {
    const storage = createStorage();
    const questions = QuestionBank.load(storage);
    questions[0].correctAnswer = "missing";

    assert.throws(function () {
        QuestionBank.save(storage, questions);
    }, /correct answer must match/i);
});
