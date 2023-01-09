"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
class ValueObject {
    constructor(props) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const baseProps = Object.assign({}, props);
        this.props = baseProps;
    }
    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
}
exports.ValueObject = ValueObject;
