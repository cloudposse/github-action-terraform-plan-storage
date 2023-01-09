"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const fs_1 = require("fs");
const readFile = (path) => {
    return (0, fs_1.readFileSync)(path, "utf8");
};
exports.readFile = readFile;
