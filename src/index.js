"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const bot_1 = require("./bot");
/**
 * 🤔😅🥰🥵🤨🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 *
 */
/** online push */
async function online() {
    sendadmins(this, "重连成功!可以愉快玩耍了!");
}
/** sendmsg all admins */
async function sendadmins(bot, msg) {
    const admins = config_1.config.getadmins();
    admins.forEach((e) => {
        if (bot.fl.has(e)) {
            return bot.sendPrivateMsg(e, msg);
        }
        else {
            console.log(e);
            bot.logger.warn(`${bot.fl.get(e)?.nickname}不是你的好友!无法发送消息!`);
            return bot.sendPrivateMsg(admins[0], `${bot.fl.get(e)?.nickname}不是你的好友!无法发送消息!`);
        }
    });
}
async function adminsEvents(bot) {
    bot.on("system.online", online);
}
/** create a client🥥 */
(async function step() {
    const bot = await bot_1.client.create();
    bot.once('system.online', () => {
        bot.logger.mark('上线成功!');
        adminsEvents(bot);
    });
})();
