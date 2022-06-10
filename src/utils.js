"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systen = void 0;
const os = require("os");
// import * as 
class systen {
    /** cpu */
    static cpu() {
        const cpus = os.cpus();
        /** arch */
        const arch = os.arch();
        /** core */
        const core = cpus.length;
        /** model */
        const cpumodel = cpus[0].model;
        return { arch, core, cpumodel };
    }
    /** memory */
    static memory() {
        /** All mem */
        const memory_ = os.totalmem();
        const memory__ = memory_ / 1024 / 1024 / 1024;
        const memory = slice_(memory__);
        /** Free mem */
        const freemem_ = os.freemem();
        const _freemem = freemem_ / 1024 / 1024 / 1024;
        const freemem__ = _freemem > 1 ? _freemem : _freemem * 1024;
        const freemem = slice_(freemem__);
        /** Uesd mem */
        const usedmem_ = (memory_ - freemem_) / 1024 / 1024 / 1024;
        const usedmem__ = usedmem_ > 1 ? usedmem_ : usedmem_ * 1024;
        const usedmem = slice_(usedmem__);
        /** percent */
        const usepercent__ = usedmem__ / memory__ * 100;
        const usepercent = slice_(usepercent__);
        console.log({ memory, freemem, usedmem, usepercent });
        return { memory, freemem, usedmem, usepercent };
    }
    /** systen */
    static OStype() {
        const sys = os.type();
        switch (sys) {
            case `Windows_NT`:
                return `windows`;
            case `Linux`:
                return `linux`;
            case `Darwin`:
                return `Mac`;
        }
    }
}
exports.systen = systen;
const slice_ = (e) => {
    const str = e.toString();
    const index_ = str.indexOf(".") + 3;
    const result = str.slice(0, index_);
    return result;
};
