"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const UniqueEntityId_1 = require("./UniqueEntityId");
class Entity {
    constructor(props, id) {
        this._id = id ? id : new UniqueEntityId_1.UniqueEntityId();
        this.props = props;
    }
    equals(object) {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        // We need to disbale this rule because there is a circular relationship between Entity and isEntity
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!isEntity(object)) {
            return false;
        }
        return this._id.equals(object._id);
    }
}
exports.Entity = Entity;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntity = (v) => {
    return v instanceof Entity;
};
