"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const GameServer_1 = __importDefault(require("./GameServer"));
const app = new GameServer_1.default().app;
exports.app = app;
//# sourceMappingURL=server.js.map