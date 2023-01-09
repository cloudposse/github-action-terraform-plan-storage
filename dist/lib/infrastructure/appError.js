"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const result_1 = require("./result");
// eslint-disable-next-line @typescript-eslint/no-namespace
var AppError;
(function (AppError) {
    class UnexpectedError extends result_1.Result {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(err) {
            super(false, {
                message: `An unexpected error occurred.`,
                error: err,
                stack: err.stack,
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        static create(err) {
            return new UnexpectedError(err);
        }
    }
    AppError.UnexpectedError = UnexpectedError;
})(AppError = exports.AppError || (exports.AppError = {}));
