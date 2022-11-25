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
exports.OS = void 0;
var io_1 = require("./io");
var process_1 = require("./process");
var algorithms_1 = require("./scheduling/algorithms");
var process_table_1 = require("./process-table");
var utilities_1 = require("./utilities");
var OS = /** @class */ (function () {
    function OS() {
        this.IO = new io_1.IO();
        this.ProcessTable = new process_table_1.ProcessTable(this.createProcesses());
        this.Scheduler = new algorithms_1.PriorityScheduler(this.ProcessTable);
    }
    OS.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.IO.start();
                        return [4 /*yield*/, this.Scheduler.run()];
                    case 1:
                        _a.sent();
                        this.createProcessesAsynchronous();
                        return [2 /*return*/];
                }
            });
        });
    };
    OS.prototype.createProcessesAsynchronous = function () {
        var _this = this;
        setInterval(function () {
            _this.ProcessTable.add(new process_1.Process("music", 6, {
                quantum: 10,
                burstTime: 30,
                priority: 1,
                category: "interactive",
            }));
        }, 50 * utilities_1.TM);
    };
    OS.prototype.createProcesses = function () {
        return [
            new process_1.Process("window-manager", 1, {
                quantum: 10,
                burstTime: 20,
                priority: 5,
                category: "daemon",
            }),
            new process_1.Process("browser", 2, {
                quantum: 10,
                burstTime: 100,
                priority: 1,
                category: "interactive",
            }),
            new process_1.Process("email-daemon", 3, {
                quantum: 10,
                burstTime: 50,
                priority: 10,
                category: "daemon",
            }),
            new process_1.Process("terminal", 4, {
                quantum: 10,
                burstTime: 10,
                priority: 10,
                category: "interactive",
            }),
            new process_1.Process("system-monitor", 5, {
                quantum: 10,
                burstTime: 10,
                priority: 10,
                category: "daemon",
            }),
        ];
    };
    return OS;
}());
exports.OS = OS;
//# sourceMappingURL=os.js.map