"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHash = void 0;
const node_crypto_1 = require("node:crypto");
const calculateHash = (plan) => {
    return (0, node_crypto_1.createHash)("sha256").update(plan).digest("hex");
};
exports.calculateHash = calculateHash;
