"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlanStack = void 0;
const domain_1 = require("@lib/domain");
const infrastructure_1 = require("@lib/infrastructure");
class TerraformPlanStack extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(props) {
        const nullGuardResult = infrastructure_1.Guard.againstNullOrUndefined(props.value, "stack");
        if (nullGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nullGuardResult.getErrorValue());
        }
        const minGuardResult = infrastructure_1.Guard.againstMinLength(this.minLength, props.value, "stack");
        const maxGuardResult = infrastructure_1.Guard.againstMaxLength(this.maxLength, props.value, "stack");
        if (minGuardResult.isFailure) {
            return infrastructure_1.Result.fail(minGuardResult.getErrorValue());
        }
        if (maxGuardResult.isFailure) {
            return infrastructure_1.Result.fail(maxGuardResult.getErrorValue());
        }
        return infrastructure_1.Result.ok(new TerraformPlanStack(props));
    }
}
exports.TerraformPlanStack = TerraformPlanStack;
TerraformPlanStack.minLength = 2;
TerraformPlanStack.maxLength = 255;
