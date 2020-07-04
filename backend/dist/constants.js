"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameEvent;
(function (GameEvent) {
    GameEvent["CONNECT"] = "connect";
    GameEvent["SEARCH_GAME"] = "searchGame ";
    GameEvent["START_GAME"] = "startGame";
    GameEvent["ON_MOVE"] = "onMove";
    GameEvent["ON_WINNER"] = "onWinner";
    GameEvent["UPDATE_BOARD"] = "updateBoard";
})(GameEvent || (GameEvent = {}));
var Mark;
(function (Mark) {
    Mark["X"] = "x";
    Mark["O"] = "o";
})(Mark || (Mark = {}));
exports.default = {
    GameEvent,
    Mark
};
//# sourceMappingURL=constants.js.map