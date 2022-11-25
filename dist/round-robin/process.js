"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
var Process = /** @class */ (function () {
    function Process(name) {
        this.name = name;
        this.state = ProcessStates.Waiting;
    }
    Process.prototype.start = function () {
        var _this = this;
        console.log("-- \"".concat(this.name, "\" started --"));
        this.state = ProcessStates.Running;
        this.execution = setInterval(function () {
            // ...processing
            console.log("\"".concat(_this.name, "\" running..."));
            // ...processing
        }, 100);
    };
    Process.prototype.stop = function () {
        this.state = ProcessStates.Blocked;
        clearInterval(this.execution);
        console.log("-- \"".concat(this.name, "\" stopped --"));
    };
    return Process;
}());
exports.Process = Process;
var ProcessStates;
(function (ProcessStates) {
    ProcessStates[ProcessStates["Running"] = 1] = "Running";
    ProcessStates[ProcessStates["Waiting"] = 2] = "Waiting";
    ProcessStates[ProcessStates["Blocked"] = 3] = "Blocked";
})(ProcessStates || (ProcessStates = {}));
//# sourceMappingURL=process.js.map