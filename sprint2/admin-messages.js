// TEST-05 / VFR-10: Error handling and user messages for the administrator side.
// Every admin error uses one of these messages so the UI and the tests agree.
(function (root, factory) {
    const api = factory();

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.AdminMessages = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const MESSAGES = Object.freeze({
        LOGIN_REQUIRED_FIELDS: "Please enter both username and password.",
        LOGIN_INVALID: "Invalid username or password.",
        LOGIN_SUCCESS: "Login successful.",
        LOGOUT_SUCCESS: "You have been logged out.",
        NOT_AUTHENTICATED: "Access denied. Please log in as an administrator.",
        SESSION_EXPIRED: "Your session has expired. Please log in again.",
        QUESTION_LIST_INVALID: "The question list is not available.",
        QUESTION_ID_REQUIRED: "A question id is required.",
        QUESTION_NOT_FOUND: "Question not found.",
        QUESTION_TEXT_REQUIRED: "Question text cannot be empty.",
        OPTIONS_INVALID: "A question must have at least 2 options.",
        OPTION_EMPTY: "Options cannot be empty.",
        OPTIONS_DUPLICATE: "Options must be different from each other.",
        CORRECT_ANSWER_INVALID: "The correct answer must be one of the options.",
        ID_CHANGE_NOT_ALLOWED: "A question id cannot be changed.",
        NO_CHANGES: "No changes were provided.",
        EDIT_SUCCESS: "Question updated successfully.",
        DELETE_SUCCESS: "Question deleted successfully."
    });

    class AdminError extends Error {
        constructor(code) {
            super(MESSAGES[code] || "Something went wrong. Please try again.");
            this.name = "AdminError";
            this.code = code;
        }
    }

    // Turns any thrown error into a safe message for the screen.
    function toUserMessage(error) {
        if (error instanceof AdminError) {
            return error.message;
        }
        return "Something went wrong. Please try again.";
    }

    return { MESSAGES: MESSAGES, AdminError: AdminError, toUserMessage: toUserMessage };
}));
