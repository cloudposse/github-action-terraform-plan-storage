"use strict";
/* eslint-disable @typescript-eslint/no-namespace */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveTerraformPlanErrors = void 0;
const infrastructure_1 = require("@lib/infrastructure");
var SaveTerraformPlanErrors;
(function (SaveTerraformPlanErrors) {
    class FileNotFoundError extends infrastructure_1.Result {
        constructor(path) {
            const message = `The file ${path} does not exist.`;
            super(false, {
                message,
            });
        }
    }
    SaveTerraformPlanErrors.FileNotFoundError = FileNotFoundError;
    class EmptyPlanError extends infrastructure_1.Result {
        constructor() {
            const message = `An empty plan file was specified`;
            super(false, {
                message,
            });
        }
    }
    SaveTerraformPlanErrors.EmptyPlanError = EmptyPlanError;
})(SaveTerraformPlanErrors = exports.SaveTerraformPlanErrors || (exports.SaveTerraformPlanErrors = {}));
