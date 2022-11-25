"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTable = void 0;
var process_1 = require("./process");
var event_bus_1 = require("./event-bus");
var ProcessTable = /** @class */ (function () {
    function ProcessTable(processes) {
        this.processes = processes;
    }
    ProcessTable.prototype.getAll = function () {
        return this.processes;
    };
    ProcessTable.prototype.getByPID = function (pid) {
        return this.processes.find(function (process) { return process.pid === pid; });
    };
    ProcessTable.prototype.getIndexByPID = function (pid) {
        return this.processes.findIndex(function (process) { return process.pid === pid; });
    };
    ProcessTable.prototype.areAllBlocked = function (pids) {
        if (!pids || !pids.length) {
            return this.processes.every(function (process) { return process.state !== process_1.ProcessStates.Waiting; });
        }
        return this.processes.every(function (process) {
            return pids.includes(process.pid);
        });
    };
    ProcessTable.prototype.setProcessState = function (pid, state) {
        var index = this.getIndexByPID(pid);
        if (index < 0)
            return;
        this.processes[index].state = state;
    };
    ProcessTable.prototype.add = function (process) {
        this.processes.push(process);
        console.log("");
        event_bus_1.EventBus.emit("process:new", process.pid);
    };
    ProcessTable.prototype.completed = function (pid) {
        var index = this.processes.findIndex(function (process) { return process.pid === pid; });
        this.processes.splice(index, 1);
    };
    return ProcessTable;
}());
exports.ProcessTable = ProcessTable;
//# sourceMappingURL=process-table.js.map