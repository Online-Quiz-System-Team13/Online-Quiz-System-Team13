// FR-12: Delete Question
// Only a logged-in administrator can delete. Other question ids are not changed,
// so answers and scoring for the remaining questions still work.
(function (root, factory) {
    const isNode = typeof module !== "undefined" && module.exports;
    const messages = isNode ? require("./admin-messages") : root.AdminMessages;
    const auth = isNode ? require("./FR-09-admin-login") : root.AdminAuth;
    const edit = isNode ? require("./FR-11-edit-question") : root.AdminEditQuestion;
    const api = factory(messages, auth, edit);

    if (isNode) {
        module.exports = api;
    }
    if (root) {
        root.AdminDeleteQuestion = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function (adminMessages, auth, edit) {
    "use strict";

    function deleteQuestion(questions, token, id) {
        auth.requireAdmin(token);
        const index = edit.findQuestionIndex(questions, id);
        const removed = questions.splice(index, 1)[0];
        return { success: true, question: removed, message: adminMessages.MESSAGES.DELETE_SUCCESS };
    }

    return { deleteQuestion: deleteQuestion };
}));
