"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.RoundRobinScheduler = void 0;
var index_1 = require("../../index");
var process_1 = require("../../../process");
var utilities_1 = require("../../../utilities");
var event_bus_1 = require("../../../event-bus");
var RoundRobinScheduler = /** @class */ (function (_super) {
    __extends(RoundRobinScheduler, _super);
    function RoundRobinScheduler(processTable) {
        var _this = _super.call(this, processTable) || this;
        _this.processTable = processTable;
        _this.queue = []; // All processes PIDs by order
        return _this;
    }
    RoundRobinScheduler.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentProcessPID, currentProcess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.queue = this.processTable.getAll().map(function (process) { return process.pid; });
                        // External events
                        this.onIOResponse();
                        this.onNewProcess();
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 7];
                        if (!!this.queue.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, utilities_1.wait(utilities_1.TM)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        currentProcessPID = this.queue[0];
                        currentProcess = this.processTable.getByPID(currentProcessPID);
                        if (!(currentProcess.state !== process_1.ProcessStates.Waiting)) return [3 /*break*/, 5];
                        this.moveProcessToBack();
                        return [4 /*yield*/, this.waitIfAllProcessesBlocked()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 5:
                        // Start process
                        this.current = currentProcessPID;
                        currentProcess.start();
                        // Wait for its quantum to finish
                        return [4 /*yield*/, Promise.race([
                                this.waitForProcessQuantum(currentProcess),
                                this.waitForProcessToBlock(currentProcess),
                                this.waitForProcessToComplete(currentProcess),
                            ])
                            // Stop process and insert it at the end of the queue
                        ];
                    case 6:
                        // Wait for its quantum to finish
                        _a.sent();
                        // Stop process and insert it at the end of the queue
                        currentProcess.stop();
                        this.moveProcessToBack();
                        this.removeWaitingEventListeners();
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RoundRobinScheduler.prototype.onNewProcess = function () {
        var _this = this;
        event_bus_1.EventBus.on("process:new", function (pid) {
            _this.queue.push(pid);
        });
    };
    RoundRobinScheduler.prototype.moveProcessToBack = function () {
        var isProcessCompleted = this.processTable.getAll()[0].state === process_1.ProcessStates.Completed;
        if (isProcessCompleted) {
            this.queue.shift();
            return;
        }
        this.queue.shift();
        this.queue.push(0);
    };
    return RoundRobinScheduler;
}(index_1.Scheduler));
exports.RoundRobinScheduler = RoundRobinScheduler;
//# sourceMappingURL=index.js.map