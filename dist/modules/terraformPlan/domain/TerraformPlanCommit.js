"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerraformPlanCommit = void 0;
const domain_1 = require("@lib/domain");
const infrastructure_1 = require("@lib/infrastructure");
class TerraformPlanCommit extends domain_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const nullGuardResult = infrastructure_1.Guard.againstNullOrUndefined(props.value, "commit");
        if (nullGuardResult.isFailure) {
            return infrastructure_1.Result.fail(nullGuardResult.getErrorValue());
        }
        const sha1GuardResult = infrastructure_1.Guard.againstSHA1(props.value, "commit");
        if (sha1GuardResult.isFailure) {
            return infrastructure_1.Result.fail(sha1GuardResult.getErrorValue());
        }
        return infrastructure_1.Result.ok(new TerraformPlanCommit(props));
    }
}
exports.TerraformPlanCommit = TerraformPlanCommit;
