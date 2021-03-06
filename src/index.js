"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as fs from 'fs';
const oicq_1 = require("@cummins/oicq");
const bot_1 = require("./bot");
const utils_1 = require("./utils");
const plugin_1 = require("./plugin");
/**
 * ๐ค๐๐ฅฐ๐ฅต๐คจโโ๐ฅฅ๐๐๐๐๐ช๐ฎ๐น
 * ๆ ่งๅๅฝๅๆณ๐ฅต๐ฅฐ๐ฅฐ๐ฅฐ
 * ๆ ่งๅๆณจ้
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
    sendadmins(this, "โ้่ฟๆๅ");
}
function onlineActivity(bot) {
    try {
        let msg = "";
        const size = (0, plugin_1.onlineActivate)(bot);
        msg += `โไธ็บฟๆๅ!ๅฏไปฅๆๅฟซ็ฉ่ไบ!\n`;
        msg += `โๅฏ็จไบ${size}ไธชๆไปถ`;
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
                bot.logger.warn(`โ${stranger}ไธๆฏไฝ ็ๅฅฝๅ!ๆ ๆณๅ้ๆถๆฏ!`);
                bot.sendPrivateMsg(admins[0], `็ฎก็ๅ"${stranger}"ไธๆฏไฝ ็ๅฅฝๅ!ๆ ๆณๅ้ๆถๆฏ!`);
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
function sys(this_) {
    const { arch, core, cpumodel } = utils_1.systen.cpu();
    const { memory, usedmem, usepercent } = utils_1.systen.memory();
    const OStype = utils_1.systen.OStype();
    const usedmemory = parseInt(usedmem) < parseInt(memory) ? usedmem + "G" : usedmem + "G";
    const { start_time, recv_msg_cnt, sent_msg_cnt, msg_cnt_per_min } = this_.stat;
    let status = this_.status;
    switch (status) {
        case 11:
            status = "ๆๅจ็บฟไธ";
            break;
        case 31:
            status = "็ฆปๅผ";
            break;
        case 41:
            status = "้่บซ";
            break;
        case 50:
            status = "ๅฟ็ข";
            break;
        case 60:
            status = "Qๆๅง";
            break;
        case 70:
            status = "่ฏทๅฟๆๆฐ";
            break;
    }
    const msg_ = [];
    msg_.push(oicq_1.segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${this_.uin}`));
    msg_.push(`ๆต็งฐ: ${this_.nickname}\n`);
    msg_.push(`ๆงๅซ: ${this_.sex}\n`);
    msg_.push(`็ถๆ: ${status}\n`);
    msg_.push(`ๆถๅฐๆถๆฏๆปๆฐ: ${recv_msg_cnt}\n`);
    msg_.push(`ๅ้ๆถๆฏๆปๆฐ: ${sent_msg_cnt}\n`);
    msg_.push(`ๆฏๅ้ๆฐ: ${msg_cnt_per_min}\n`);
    msg_.push(`cpuๆถๆ: ${arch}\n`);
    msg_.push(`ๆไฝ็ณป็ป: ${OStype}\n`);
    msg_.push(`cpu: ${cpumodel} ${core}ๆ ธ\n`);
    msg_.push(`ๅๅญ: ${usedmemory}/${memory}G ${usepercent}%`);
    return msg_;
}
function cmdHanders(cmd, params) {
    const cmd_ = params[0];
    const cmd__ = params[1];
    try {
        let msg = "";
        if (cmd === "่ฏฆๆ") {
            return sys(this);
        }
        if (cmd === "ๅธฎๅฉ" || cmd === "help") {
            msg += `#่ฏฆๆ [ๆบๅจไบบ่ฏฆๆ]\n`;
            msg += `#ๆไปถ [ๆไปถๅธฎๅฉ]\n`;
            msg += `\n`;
            return msg;
        }
        if (cmd === "ๆไปถ" || cmd === "plugin") {
            if (cmd_) {
                switch (cmd_) {
                    case "ls":
                        return (0, plugin_1.pluginlist)();
                    case "ๅฏ็จ":
                        if (!cmd__)
                            return `ๆฒกๅธฆๅๆฐ?`;
                        return (0, plugin_1.activate)(cmd__, this);
                    case "็ฆ็จ":
                        if (!cmd__)
                            return `ๆฒกๅธฆๅๆฐ?`;
                        return (0, plugin_1.deactivate)(cmd__, this);
                    default:
                        return `ไฝ ๆฒกๅธฆๅๆฐ? ๅฆ: cmd cmd_ data`;
                }
            }
            msg += `#${cmd} ls\n`;
            msg += `#${cmd} ๅฏ็จ ๆไปถๅ\n`;
            msg += `$${cmd}\n`;
            return msg;
        }
        if (cmd === "้่ฝฝ" || cmd === "reload") {
            if (!cmd_)
                return `#${cmd} ๆไปถๅ`;
            return (0, plugin_1.reload)(cmd_, this);
        }
        return 0;
    }
    catch (e) {
        return `error: ${e.message}`;
    }
}
/** create client๐ฅฅ */
(async function step() {
    const bot = await bot_1.client.create();
    bot.once('system.online', () => {
        bot.logger.mark('ไธ็บฟๆๅ!');
        onlineActivity(bot);
        adminsEvents(bot);
        events(bot);
    });
})();
