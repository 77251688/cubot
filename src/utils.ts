import * as fs from "fs";
import {readdirSync} from "fs";
import * as os from "os";
import {config} from "./config";

export class Admin {
    public static get getmaster(): number {
        const {admins} = config.returnconfig();
        return admins[0];
    }

    public static get getmasterArr(): Array<number> {
        const {admins} = config.returnconfig();
        return [admins[0]];
    }

    public static get getadmins() {
        const {admins} = config.returnconfig();
        return admins;
    }

    public static setAdmin(uid: number) {
        try {
            const config_ = config.returnconfig();
            if (this.getadmins().includes(uid)) {
                return `❌${uid}已经设置过了你想怎样?`;
            }
            config_.admins.push(uid);
            const status = config.writeconfig(config_);
            if (status) {
                return "✅设置成功!";
            } else {
                return "❌设置失败! 原因未知";
            }
        } catch (e) {
            console.log(e);
        }
    }

    public static removeAdmin(uid: number) {
        try {
            const config_ = config.returnconfig();
            const {admins} = config_;
            if (!admins.includes(uid))
                return "❌删除失败! 没有这个管理员!";
            const i = admins.indexOf(uid);
            admins.splice(i, 1);
            config_.admins = admins;
            const status = config.writeconfig(config_);
            if (status) {
                return "✅删除成功!";
            } else {
                return "❌删除失败! 原因未知";
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export class system {
    /** cpu */
    public static get cpu() {
        const cpus = os.cpus();
        /** arch */
        const arch = os.arch();
        /** core */
        const core = cpus.length;
        /** model */
        const cpumodel = cpus[0].model;
        return {arch, core, cpumodel};
    }

    /** memory */
    public static get memory() {
        /** All mem */
        const memory_ = os.totalmem();
        const memory__ = memory_ / 1024 / 1024 / 1024;
        const memory = memory__.toFixed(3);
        /** Free mem */
        const freemem_ = os.freemem();
        const _freemem = freemem_ / 1024 / 1024 / 1024;
        const freemem__ = _freemem > 1 ? _freemem : _freemem * 1024;
        const freemem = freemem__.toFixed(3);
        /** Uesd mem */
        const usedmem_ = (memory_ - freemem_) / 1024 / 1024 / 1024;
        const usedmem__ = usedmem_ > 1 ? usedmem_ : usedmem_ * 1024;
        const usedmem = usedmem__.toFixed(3);
        /** percent */
        const usepercent__ = usedmem__ / memory__ * 100;
        const usepercent = usepercent__.toFixed(3);
        return {memory, freemem, usedmem, usepercent};
    }

    public static get processmemory() {
        const {rss, heapTotal, heapUsed, external, arrayBuffers} = process.memoryUsage();
        const rss_ = (rss / 1024 / 1024).toFixed(3);
        const heapTotal_ = (heapTotal / 1024 / 1024).toFixed(3);
        const heapUsed_ = (heapUsed / 1024 / 1024).toFixed(3);
        const external_ = (external / 1024 / 1024).toFixed(3);
        const arrayBuffers_ = (arrayBuffers / 1024 / 1024).toFixed(3);
        return {rss_, heapTotal_, heapUsed_, external_, arrayBuffers_};
    }

    /** OS */
    public static get OStype() {
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

/**
 * File类
 */
export class file {
    /**
     * 读取json文件, 返回格式化后的json
     * @param file
     */
    public static returnFile<T>(file: string): T {
        const f = fs.readFileSync(file, "utf-8");
        return JSON.parse(f);
    }

    /**
     * 把json写入文件, 不需要传格式化后的json, 直接传json
     * @param file
     * @param data
     */
    public static writeFile(file: string, data: object) {
        const data_ = JSON.stringify(data, null, "\t");
        fs.writeFileSync(file, data_);
    }

    /**
     * 封装读取目录
     * @param path
     */
    public static readdir(path: string) {
        try {
            return readdirSync(path);
        } catch (err) {
            console.log(err);
            return [];
        }
    }
}

/** random */
export class random {
    /** 随机整数包含两个数 */
    public static intrandom(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}