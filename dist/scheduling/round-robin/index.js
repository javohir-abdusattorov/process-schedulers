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
exports.Scheduler = void 0;
var process_1 = require("../../process");
var utilities_1 = require("../../utilities");
var event_bus_1 = require("../../event-bus");
var Scheduler = /** @class */ (function () {
    function Scheduler(processes) {
        this.processes = processes;
        this.queue = []; // All processes indexes by order
    }
    Scheduler.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentProcessIndex, currentProcess, listener;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.queue = [0, 1, 2, 3, 4];
                        // Assigning each process with quantum
                        this.processes[0].quantum = 10;
                        this.processes[1].quantum = 50;
                        this.processes[2].quantum = 5;
                        this.processes[3].quantum = 5;
                        this.processes[4].quantum = 2;
                        // IO responses
                        this.onIOResponse();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        currentProcessIndex = this.queue[0];
                        currentProcess = this.processes[currentProcessIndex];
                        console.log("Process \"".concat(currentProcess.name, "\" state - ").concat(currentProcess.state));
                        if (currentProcess.state !== process_1.ProcessStates.Waiting) {
                            this.moveProcessToBack(currentProcessIndex);
                            return [3 /*break*/, 1];
                        }
                        // Start process
                        this.current = currentProcessIndex;
                        currentProcess.start();
                        // Wait for its quantum to finish
                        return [4 /*yield*/, this.waitForProcessToBlockOrFinish(currentProcess)
                            // Stop process and insert it at the end of the queue
                        ];
                    case 2:
                        // Wait for its quantum to finish
                        _a.sent();
                        // Stop process and insert it at the end of the queue
                        currentProcess.stop();
                        this.moveProcessToBack(currentProcessIndex);
                        listener = event_bus_1.EventBus.listeners("io:request")[1];
                        if (listener)
                            event_bus_1.EventBus.removeListener("io:request", listener);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Scheduler.prototype.moveProcessToBack = function (index) {
        this.queue.shift();
        this.queue.push(index);
    };
    Scheduler.prototype.waitForProcessToBlockOrFinish = function (process) {
        return __awaiter(this, void 0, void 0, function () {
            var waitForFinish, waitForBlock;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waitForFinish = (0, utilities_1.wait)(process.quantum * utilities_1.TM);
                        waitForBlock = new Promise(function (done) {
                            event_bus_1.EventBus.once("io:request", function (pid) {
                                var isCurrentProcess = pid === _this.processes[_this.current].pid;
                                if (isCurrentProcess)
                                    return done();
                            });
                        });
                        return [4 /*yield*/, Promise.race([
                                waitForBlock,
                                waitForFinish,
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Scheduler.prototype.onIOResponse = function () {
        var _this = this;
        event_bus_1.EventBus.on("io:response", function (pid) {
            var index = _this.processes.findIndex(function (process) { return process.pid === pid; });
            if (index < 0)
                return;
            _this.processes[index].state = process_1.ProcessStates.Waiting;
            console.log("IO FINISHED: \"".concat(_this.processes[index].name, "\""));
        });
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
//# sourceMappingURL=index.js.map