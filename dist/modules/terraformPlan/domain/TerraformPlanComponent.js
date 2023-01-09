"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlanComponent = void 0;
const domain_1 = require("@lib/domain");
const infrastructure_1 = require("@lib/infrastructure");
class TerraformPlanComponent extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(props) {
        const nullGuardResult = infrastructure_1.Guard.againstNullOrUndefined(props.value, "component");
        if (nullGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nullGuardResult.getErrorValue());
        }
        const minGuardResult = infrastructure_1.Guard.againstMinLength(this.minLength, props.value, "component");
        const maxGuardResult = infrastructure_1.Guard.againstMaxLength(this.maxLength, props.value, "component");
        if (minGuardResult.isFailure) {
            return infrastructure_1.Result.fail(minGuardResult.getErrorValue());
        }
        if (maxGuardResult.isFailure) {
            return infrastructure_1.Result.fail(maxGuardResult.getErrorValue());
        }
        return infrastructure_1.Result.ok(new TerraformPlanComponent(props));
    }
}
exports.TerraformPlanComponent = TerraformPlanComponent;
TerraformPlanComponent.minLength = 2;
TerraformPlanComponent.maxLength = 255;
