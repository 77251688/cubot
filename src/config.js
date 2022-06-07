"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs = require("fs");
/**
 * @config
 *
 */
class config {
    static create() {
        fs.writeFileSync('../config', '');
    }
    /** initwriteconfig */
    static initwriteconfig() {
        const initobj = { "bot": '', "mode": "qrcode", "password": "", "admins": [], "plugins": [], "platform": 5 };
        const config = JSON.stringify(initobj, null, '\t');
        fs.writeFileSync('../config.json', config);
    }
    /** admin */
    static admin() {
        console.log(`\n输入机器人管理员账号 回车确定\n`);
        return new Promise(res => {
            process.stdin.once('data', sysin => {
                const admin_ = String(sysin).trim();
                const admin = parseInt(admin_);
                const config_ = config.returnconfig();
                config_.admins.push(admin);
                config.writeconfig(config_);
                res(admin);
            });
        }).then();
    }
    /** clientid */
    static clientid() {
        console.log(`输入你的机器人qq号\n完成后按回车`);
        return new Promise(res => {
            process.stdin.once('data', sysin => {
                const clientid = String(sysin).trim();
                const config_ = config.returnconfig();
                config_.bot = parseInt(clientid);
                config.writeconfig(config_);
                res(clientid);
            });
        }).then();
    }
    /** system in mode mode 1:qrcode is default ≠1||≠null:password */
    static loginmode() {
        return new Promise((res, reject) => {
            console.log(`\n选择你的登录方式:\n   直接按回车或输入1后按回车二维码登录\n   随便输入一个除1外的字符按回车即可密码登录`);
            process.stdin.once("data", sysin => {
                const loginmode = String(sysin).trim();
                const config_ = config.returnconfig();
                if (loginmode === "1" || loginmode === "") {
                    res(loginmode);
                    return;
                }
                console.log(`\n当前选择密码登录\n输入你的密码:\n`);
                process.stdin.once('data', sysin => {
                    const password = String(sysin).trim();
                    console.log(password);
                    const config_ = config.returnconfig();
                    config_.mode = "password";
                    config_.password = password;
                    config.writeconfig(config_);
                    res(loginmode);
                });
            });
        }).then();
    }
    /** system in platform mode:number 5:iPad is default*/
    static platform() {
        return new Promise((res, reject) => {
            console.log(`\n选择登录设备:默认5(iPad)\n\tAndroid = 1\n\taPad = 2\n\tWatch = 3\n\tiMac = 4\n\tiPad = 5`);
            process.stdin.once("data", sysin => {
                const config_ = config.returnconfig();
                const platform = String(sysin).trim();
                if (platform === "5" || platform === '') {
                    res(platform);
                    return;
                }
                config_.platform = parseInt(platform);
                config.writeconfig(config_);
                res(platform);
            });
        }).then();
    }
    /** return ../ list is has config.json? */
    static readlist() {
        return fs.readdirSync('../');
    }
    /** rename config to config.json */
    static rename() {
        fs.renameSync('../config', '../config.json');
    }
    /** return config.json config in  */
    static returnconfig() {
        return JSON.parse(fs.readFileSync('../config.json', 'utf8'));
    }
    /** write config */
    static writeconfig(data) {
        const config = JSON.stringify(data, null, '\t');
        fs.writeFileSync('../config.json', config);
    }
}
exports.config = config;
