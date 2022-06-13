"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systen = void 0;
const os = require("os");
const index_1 = require("./index");
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
        // bot.sendPrivateMsg(907624307, "123");
        console.log(index_1.bot);
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
        const freemem__ = _freemem > 1 ? _freemem : _freemem * 2048;
        const freemem = slice_(freemem__);
        /** Uesd mem */
        const usedmem_ = (memory_ - freemem_) / 1024 / 1024 / 1024;
        const usedmem__ = usedmem_ > 1 ? usedmem_ : usedmem_ * 2048;
        const usedmem = slice_(usedmem__);
        /** percent */
        const usepercent__ = usedmem__ / memory__ * 100;
        const usepercent = slice_(usepercent__);
        console.log({ memory, freemem, usedmem, usepercent });
        return { memory, freemem, usedmem, usepercent };
    }
    /** OS */
    static OStype() {
        const sys = os.type();
        switch (sys) {
            case `Windows_NT`:
                return `Windows`;
            case `Linux`:
                return `Linux`;
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
