import { config } from './config';
import { Client, createClient } from '@cummins/oicq';
/**
 * 🤔😅🥰🥵🤨🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 */
/** create client🥰 */
export class client {
    static async create() {
        await Initbot.init();
        const { bot: bot_, platform: platform_ } = config.returnconfig();
        const bot = createClient(bot_, { platform: platform_ });
        login.loginmethod(bot);
        return bot;
    }
}
/** initialization */
class Initbot {
    static async init() {
        const list = config.readlist();
        /** include config.json? */
        if (!(list.includes('config.json'))) {
            config.create();
            config.rename();
            config.initwriteconfig();
            await config.sysin();
            await config.verifymethod();
        }
    }
}
/** login method class */
class login {
    static loginmethod(bot: Client): void {
        const { mode, password, verifymethod } = config.returnconfig();
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