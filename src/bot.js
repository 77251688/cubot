"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const config_1 = require("./config");
const oicq_1 = require("oicq");
/**
 * 🤔😅🥰🥵🤨🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 */
/** create a client🥰 */
class client {
    static async create() {
        await Initbot.init();
        const { bot: bot_, platform: platform_ } = config_1.config.returnconfig();
        const bot = (0, oicq_1.createClient)(bot_, { platform: platform_ });
        login.loginmethod(bot);
        return bot;
    }
}
exports.client = client;
/** initialization */
class Initbot {
    static async init() {
        const list = config_1.config.readlist();
        /** include config.json? */
        if (!(list.includes('config.json'))) {
            config_1.config.create();
            config_1.config.rename();
            config_1.config.initwriteconfig();
            await config_1.config.clientid();
            await config_1.config.admin();
            await config_1.config.loginmode();
            await config_1.config.platform();
        }
    }
}
/** login method class */
class login {
    static loginmethod(bot) {
        const { mode, password } = config_1.config.returnconfig();
        /** qrcode login */
        if (mode === "qrcode") {
            bot.on("system.login.qrcode", function (e) {
                //扫码后按回车登录
                this.logger.mark("扫码后按Enter完成登录");
                process.stdin.once("data", () => {
                    this.login();
                });
            }).login();
        }
        else {
            console.log(123);
            /** 想必不用我说了吧🤔 */
            bot.on("system.login.slider", function (e) {
                process.stdin.once("data", sysin => {
                    const input = String(sysin).trim();
                    this.sliderLogin(input); //输入ticket
                });
            }).on("system.login.device", function (e) {
                process.stdin.once("data", () => {
                    this.login(); //验证完成后按回车登录
                });
            }).login(password); //需要填写密码或md5后的密码
        }
    }
}
