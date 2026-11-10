// FR-11: Edit Question
// Uses the shared question format: { id, text, options: [...], correctAnswer }
// correctAnswer is the option text (e.g. "A"), which is what the scoring code compares.
// The question id never changes, so saved answers and scoring stay linked.
(function (root, factory) {
    const isNode = typeof module !== "undefined" && module.exports;
    const messages = isNode ? require("./admin-messages") : root.AdminMessages;
    const auth = isNode ? require("./FR-09-admin-login") : root.AdminAuth;
    const api = factory(messages, auth);

    if (isNode) {
        module.exports = api;
    }
    if (root) {
        root.AdminEditQuestion = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function (adminMessages, auth) {
    "use strict";

    const AdminError = adminMessages.AdminError;
    const MESSAGES = adminMessages.MESSAGES;

    function findQuestionIndex(questions, id) {
        if (!Array.isArray(questions)) {
            throw new AdminError("QUESTION_LIST_INVALID");
        }
        if (id === undefined || id === null || String(id).trim() === "") {
            throw new AdminError("QUESTION_ID_REQUIRED");
        }
        const index = questions.findIndex(function (q) { return String(q.id) === String(id); });
        if (index === -1) {
            throw new AdminError("QUESTION_NOT_FOUND");
        }
        return index;
    }

    function checkEditedQuestion(question) {
        if (typeof question.text !== "string" || question.text.trim() === "") {
            throw new AdminError("QUESTION_TEXT_REQUIRED");
        }
        if (!Array.isArray(question.options) || question.options.length < 2) {
            throw new AdminError("OPTIONS_INVALID");
        }
        const cleaned = question.options.map(function (o) {
            return typeof o === "string" ? o.trim() : "";
        });
        if (cleaned.some(function (o) { return o === ""; })) {
            throw new AdminError("OPTION_EMPTY");
        }
        if (new Set(cleaned).size !== cleaned.length) {
            throw new AdminError("OPTIONS_DUPLICATE");
        }
        if (cleaned.indexOf(question.correctAnswer) === -1) {
            throw new AdminError("CORRECT_ANSWER_INVALID");
        }
    }

    function editQuestion(questions, token, id, updates) {
        auth.requireAdmin(token);
        const index = findQuestionIndex(questions, id);

        if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
            throw new AdminError("NO_CHANGES");
        }
        if (updates.id !== undefined && String(updates.id) !== String(questions[index].id)) {
            throw new AdminError("ID_CHANGE_NOT_ALLOWED");
        }

        const original = questions[index];
        const edited = {
            id: original.id,
            text: updates.text !== undefined ? updates.text : original.text,
            options: updates.options !== undefined ? updates.options : original.options,
            correctAnswer: updates.correctAnswer !== undefined ? updates.correctAnswer : original.correctAnswer
        };

        if (typeof edited.correctAnswer === "string") {
            edited.correctAnswer = edited.correctAnswer.trim();
        }
        checkEditedQuestion(edited);

        edited.text = edited.text.trim();
        edited.options = edited.options.map(function (o) { return o.trim(); });

        // Replace in place so the quiz pages using the same array see the change.
        questions[index] = edited;
        return { success: true, question: edited, message: MESSAGES.EDIT_SUCCESS };
    }

    return { editQuestion: editQuestion, findQuestionIndex: findQuestionIndex };
}));
