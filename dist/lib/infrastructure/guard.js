"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const result_1 = require("./result");
class Guard {
    static againstNullOrUndefined(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    argument, argumentName) {
        if (argument === null || argument === undefined) {
            return result_1.Result.fail(`${argumentName} is null or undefined.`);
        }
        else {
            return result_1.Result.ok();
        }
    }
    static againstNullOrUndefinedBulk(args) {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (result.isFailure)
                return result;
        }
        return result_1.Result.ok();
    }
    static againstMinLength(numChars, text, argumentName) {
        return text.length >= numChars
            ? result_1.Result.ok()
            : result_1.Result.fail(`${argumentName} is not at least ${numChars} chars.`);
    }
    static againstMaxLength(numChars, text, argumentName) {
        return text.length <= numChars
            ? result_1.Result.ok()
            : result_1.Result.fail(`${argumentName} is greater than ${numChars} chars.`);
    }
    ///\b([a-f0-9]{40})\b/
    static againstSHA1(text, argumentName) {
        return text.match(/\b[0-9a-f]{5,40}\b/)
            ? result_1.Result.ok()
            : result_1.Result.fail(`${argumentName} is not a valid SHA-1 hash.`);
    }
}
exports.Guard = Guard;
