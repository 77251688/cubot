import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
/**
 * @config
 * 
 */
export class config {
    static create() {
        const path_ = config.path();
        fs.writeFileSync(`${path_}config`, '');
    }
    static path() {
        return path.join(__dirname, '../');
    }
    /** initwriteconfig */
    static initwriteconfig() {
        const initobj = { "bot": '', "mode": "qrcode", "password": "", "verifymethod": null, "admins": [], "plugins": [], "platform": 5 };
        const config_ = JSON.stringify(initobj, null, '\t');
        const path_ = config.path();
        fs.writeFileSync(`${path_}config.json`, config_);
    }
    /** sysin */
    static sysin() {
        return new Promise(res => {
            const quesions = [
                {
                    type: "input",
                    name: "clientid",
                    message: "输入机器人qq号",
                    validate: (e: string) => {
                        return e.trim() != '';
                    }
                },
                {
                    type: "input",
                    name: "admin",
                    message: "输入管理员qq号",
                    validate: (e: string) => {
                        return e.trim() != '';
                    }
                },
                {
                    type: "list",
                    name: "loginmode",
                    message: "选泽登录方式",
                    choices: [
                        "扫码登录",
                        "密码登录"
                    ]
                },
                {
                    type: "password",
                    name: "password",
                    message: "如果选了扫码登录可以不输密码 密码登录必须填"
                },
                {
                    type: "list",
                    name: "platform",
                    message: "选泽登录设备(默认iPad)",
                    choices: [
                        "1(安卓手机)",
                        "2(aPad)",
                        "3(安卓手表)",
                        "4(MacOs)",
                        "5(iPad)"
                    ],
                    default: "5(iPad)"
                }
            ];
            inquirer.prompt(quesions).then(e => {
                const { clientid, admin, loginmode, platform, password } = e;
                const config_ = config.returnconfig();
                config_.bot = parseInt(clientid);
                const admin_ = parseInt(admin);
                config_.admins.push(admin_);
                if (loginmode === "扫码登录") {
                    config_.mode = "qrcode";
                } else {
                    config_.password = password.trim();
                    config_.mode = "password";
                }
                config_.platform = parseInt(platform);
                config.writeconfig(config_);
                res(e);
            });
        });
    }
    /** return ../ list is has config.json? */
    static readlist() {
        const path_ = config.path();
        return fs.readdirSync(path_);
    }
    /** rename config to config.json */
    static rename() {
        const path_ = config.path();
        fs.renameSync(`${path_}config`, `${path_}config.json`);
    }
    /** return config.json config in  */
    static returnconfig() {
        const path_ = config.path();
        return JSON.parse(fs.readFileSync(`${path_}config.json`, 'utf8'));
    }
    /** passwordlogin verifymethod */
    static verifymethod() {
        return new Promise(res => {
            const config_ = config.returnconfig();
            if (config_.mode === "qrcode") {
                res("qrcode");
                return;
            }
            inquirer.prompt(q).then(e => {
                const { verifymethod } = e;
                if (verifymethod === "url验证") {
                    config_.verifymethod = "urlverify";
                }
                else {
                    config_.verifymethod = "SMSverify";
                }
                config.writeconfig(config_);
                res(verifymethod);
            });
        });
    }
    /** write config */
    static writeconfig(data: string) {
        const config_ = JSON.stringify(data, null, '\t');
        const path_ = config.path();
        fs.writeFileSync(`${path_}config.json`, config_);
        return true;
    }
}
/** password verifymethod */
const q = [{
    type: "list",
    name: "verifymethod",
    message: "选择验证方式",
    choices: [
        "url验证",
        "短信验证"
    ]
}];

