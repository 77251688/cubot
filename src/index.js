"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const bot_1 = require("./bot");
const utils_1 = require("./utils");
/**
 * 🤔😅🥰🥵🤨✅❌🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 *
 */
/** online push */
async function online() {
    sendadmins(this, "✅重连成功");
}
/** sendmsg all admins */
async function sendadmins(bot, msg) {
    const admins = config_1.config.getadmins();
    admins.forEach(async (e) => {
        if (bot.fl.has(e)) {
            return bot.sendPrivateMsg(e, msg);
        }
        else {
            console.log(e);
            const { nickname: stranger } = await bot.getStrangerInfo(e);
            bot.logger.warn(`❌${stranger}不是你的好友!无法发送消息!`);
            return bot.sendPrivateMsg(admins[0], `管理员"${stranger}"不是你的好友!无法发送消息!`);
        }
    });
}
async function adminsEvents(bot) {
    bot.on("system.online", online);
    bot.on("message.group", e => {
        console.log(e);
    });
    bot.on("message", sys);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sys(e) {
    const { raw_message: msg } = e;
    if (msg != "详情")
        return;
    const { arch, core, cpumodel } = utils_1.systen.cpu();
    const { memory, usedmem, usepercent } = utils_1.systen.memory();
    const OStype = utils_1.systen.OStype();
    const usedmemory = parseInt(usedmem) < parseInt(memory) ? usedmem + "G" : usedmem + "M";
    let msg_ = "";
    msg_ += `cpu架构: ${arch}\n`;
    msg_ += `操作系统: ${OStype}\n`;
    msg_ += `cpu: ${cpumodel} ${core}核\n`;
    msg_ += `内存: ${usedmemory}/${memory}G ${usepercent}%`;
    e.reply(msg_);
}
/** create a client🥥 */
(async function step() {
    const bot = await bot_1.client.create();
    bot.once('system.online', () => {
        bot.logger.mark('上线成功!');
        sendadmins(bot, `✅上线成功!可以愉快玩耍了!`);
        adminsEvents(bot);
    });
})();
