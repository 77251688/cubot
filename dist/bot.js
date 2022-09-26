"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const config_1 = require("./config");
const oicq_1 = require("@cummins/oicq");
/**
 * 🤔😅🥰🥵🤨🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 */
/** create client🥰 */
class client {
    static async create() {
        await Initbot.init();
        const { bot: bot_, platform: platform_ } = config_1.config.returnconfig();
        const bot = oicq_1.createClient(bot_, { platform: platform_ });
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
            await config_1.config.sysin();
            await config_1.config.verifymethod();
        }
    }
}
/** login method class */
class login {
    static loginmethod(bot) {
        const { mode, password, verifymethod } = config_1.config.returnconfig();
        /** qrcode login */
        if (mode === "qrcode") {
            bot.on("system.login.qrcode", function (e) {
                //扫码后按回车登录
                this.logger.mark("扫码后按Enter完成登录");
                process.stdin.once("data", () => {
                    this.login();
                });
            }).login();
            return;
        }
        /** 想必不用我说了吧🤔 */
        if (verifymethod === "urlverify") {
            bot.on("system.login.slider", function (event) {
                process.stdin.once("data", sysin => {
                    const input = String(sysin).trim();
                    this.sliderLogin(input);
                });
            }).on("system.login.device", function (event) {
                process.stdin.once("data", () => {
                    this.login();
                });
            }).login(password);
        }
        else {
            bot.on("system.login.slider", function (event) {
                process.stdin.once("data", sysin => {
                    const input = String(sysin).trim();
                    this.sliderLogin(input);
                });
            }).on("system.login.device", function (event) {
                this.sendSmsCode();
                process.stdin.once("data", sysin => {
                    this.logger.mark("输入收到的验证码");
                    const SMScode = String(sysin).trim();
                    this.submitSmsCode(SMScode);
                    this.login();
                });
            }).login(password);
        }
    }
}
