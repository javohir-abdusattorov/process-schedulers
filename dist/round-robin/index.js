"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("./process");
var utilities_1 = require("../utilities");
var processes = [
    new process_1.Process("window-manager"),
    new process_1.Process("browser"),
    new process_1.Process("email-daemon"),
    new process_1.Process("terminal"),
    new process_1.Process("system-monitor"),
];
var queue = [0, 1, 2, 3, 4] // All processes indexes by order
;
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var currentProcessIndex, currentProcess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Assigning each process with quantum
                    processes[0].quantum = 10;
                    processes[1].quantum = 50;
                    processes[2].quantum = 5;
                    processes[3].quantum = 5;
                    processes[4].quantum = 1;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    currentProcessIndex = queue[0];
                    currentProcess = processes[currentProcessIndex];
                    // Dequeue process and start it
                    queue.shift();
                    currentProcess.start();
                    // Wait for its quantum to finish
                    return [4 /*yield*/, (0, utilities_1.wait)(currentProcess.quantum * 100)
                        // Stop process and insert it at the end of the queue
                    ];
                case 2:
                    // Wait for its quantum to finish
                    _a.sent();
                    // Stop process and insert it at the end of the queue
                    currentProcess.stop();
                    queue.push(currentProcessIndex);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
})();
//# sourceMappingURL=index.js.map