"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const utils_1 = require("./utils");
const plugin_1 = require("./plugin");
/**
 * 🤔😅🥰🥵🤨✅❌🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 * 无规则注释
 */
function onMessage(e) {
    const admin = utils_1.Admin.getmaster();
    const cmdstartstr = "#";
    const { raw_message: msg, user_id: uid } = e;
    if (!(uid == admin))
        return;
    if (!msg.startsWith(cmdstartstr))
        return;
    const cmdArr = msg.trim().replace("#", "").split(" ");
    const cmd = cmdArr[0];
    const params = cmdArr.slice(1);
    const msg_ = cmdHanders.call(this, cmd, params);
    if (msg_ == 0)
        return;
    e.reply(msg_);
}
/** online push */
function online() {
    sendadmins(this, "✅重连成功");
}
function onlineActivity(bot) {
    try {
        let msg = "";
        const size = (0, plugin_1.onlineActivate)(bot);
        msg += `✅上线成功!可以愉快玩耍了!\n`;
        msg += `✅启用了${size}个插件`;
        sendadmins(bot, msg);
    }
    catch (e) {
        console.log(e);
        sendadmins(bot, e.message);
    }
}
/** sendmsg all admins */
async function sendadmins(bot, msg) {
    try {
        const admins = utils_1.Admin.getadmins();
        for (const e of admins) {
            if (bot.fl.has(e)) {
                bot.sendPrivateMsg(e, msg);
            }
            else {
                const { nickname: stranger } = await bot.getStrangerInfo(e);
                bot.logger.warn(`❌${stranger}不是你的好友!无法发送消息!`);
                bot.sendPrivateMsg(admins[0], `管理员"${stranger}"不是你的好友!无法发送消息!`);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
function adminsEvents(bot) {
    bot.on("system.online", online);
}
function events(bot) {
    bot.on("message", onMessage);
}
function sys() {
    const { arch, core, cpumodel } = utils_1.systen.cpu();
    const { memory, usedmem, usepercent } = utils_1.systen.memory();
    const OStype = utils_1.systen.OStype();
    const usedmemory = parseInt(usedmem) < parseInt(memory) ? usedmem + "G" : usedmem + "G";
    let msg_ = "";
    msg_ += `cpu架构: ${arch}\n`;
    msg_ += `操作系统: ${OStype}\n`;
    msg_ += `cpu: ${cpumodel} ${core}核\n`;
    msg_ += `内存: ${usedmemory}/${memory}G ${usepercent}%`;
    return msg_;
}
function cmdHanders(cmd, params) {
    const cmd_ = params[0];
    const cmd__ = params[1];
    try {
        let msg = "";
        if (cmd === "详情") {
            return sys();
        }
        if (cmd === "帮助" || cmd === "help") {
            msg += `#详情 [机器人详情]\n`;
            msg += `#插件 [插件帮助]\n`;
            msg += `\n`;
            return msg;
        }
        if (cmd === "插件" || cmd === "plugin") {
            if (cmd_) {
                switch (cmd_) {
                    case "ls":
                        return (0, plugin_1.pluginlist)();
                    case "启用":
                        if (!cmd__)
                            return `没带参数?`;
                        return (0, plugin_1.activate)(cmd__, this);
                    case "禁用":
                        if (!cmd__)
                            return `没带参数?`;
                        return (0, plugin_1.deactivate)(cmd__, this);
                    default:
                        return `你没带参数? 如: cmd cmd_ data`;
                }
            }
            msg += `#${cmd} ls\n`;
            msg += `#${cmd} 启用 插件名\n`;
            msg += `$${cmd}\n`;
            return msg;
        }
        if (cmd === "重载" || cmd === "reload") {
            if (!cmd_)
                return `#${cmd} 插件名`;
            return (0, plugin_1.reload)(cmd_, this);
        }
        return 0;
    }
    catch (e) {
        return `error: ${e.message}`;
    }
}
/** create client🥥 */
(async function step() {
    const bot = await bot_1.client.create();
    bot.once('system.online', () => {
        bot.logger.mark('上线成功!');
        onlineActivity(bot);
        adminsEvents(bot);
        events(bot);
    });
})();
