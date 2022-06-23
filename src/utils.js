"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = exports.systen = exports.Admin = void 0;
const fs = require("fs");
const os = require("os");
const config_1 = require("./config");
class Admin {
    static getmaster() {
        const { admins } = config_1.config.returnconfig();
        return admins[0];
    }
    static getadmins() {
        const { admins } = config_1.config.returnconfig();
        return admins;
    }
    static setAdmin(uid) {
        try {
            const config_ = config_1.config.returnconfig();
            if (this.getadmins().includes(uid)) {
                return `❌${uid}已经设置过了你想怎样?`;
            }
            config_.admins.push(uid);
            const status = config_1.config.writeconfig(config_);
            if (status === true) {
                return "✅设置成功!";
            }
            else {
                return "❌设置失败! 原因未知";
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    static removeAdmin(uid) {
        try {
            const config_ = config_1.config.returnconfig();
            const { admins } = config_;
            if (!admins.includes(uid))
                return "❌删除失败! 没有这个管理员!";
            const i = admins.indexOf(uid);
            admins.splice(i, 1);
            config_.admins = admins;
            const status = config_1.config.writeconfig(config_);
            if (status === true) {
                return "✅删除成功!";
            }
            else {
                return "❌删除失败! 原因未知";
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.Admin = Admin;
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
/**
 * json专用类
 */
class file {
    static returnFile(file) {
        const f = fs.readFileSync(file, "utf-8");
        return JSON.parse(f);
    }
    static writeFile(file, data) {
        const data_ = JSON.stringify(data, null, "\t");
        fs.writeFileSync(file, data_);
    }
}
exports.file = file;
