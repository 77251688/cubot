// import * as fs from 'fs';
import {Client, OnlineStatus, segment} from '@cummins/oicq';
import { client } from './bot';
import { system, Admin } from './utils';
import { activate, deactivate, onlineActivate, pluginlist, reload } from "./plugin";

/**
 * 🤔😅🥰🥵🤨✅❌🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 * 无规则注释
 */

function onMessage(this: Client, e: any) {
    const admin = Admin.getmaster;
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
function online(this: Client) {
    sendadmins(this, "✅重连成功");
}

function onlineActivity(bot: Client) {
    try {
        let msg = "";
        const size = onlineActivate(bot);
        msg += `✅上线成功!可以愉快玩耍了!\n`;
        msg += `✅启用了${size}个插件`;
        sendadmins(bot, msg);
    } catch (e: any) {
        console.log(e);
        sendadmins(bot, e.message);
    }
}

/** sendmsg all admins */
async function sendadmins(bot: Client, msg: string) {
    try {
        const admins = Admin.getadmins;
        for (const e of admins) {
            if (bot.fl.has(e)) {
                bot.sendPrivateMsg(e, msg);
            } else {
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

function adminsEvents(bot: Client) {
    bot.on("system.online", online);
}

function events(bot: Client) {
    bot.on("message", onMessage);
}

function sys(this_: Client) {
    const {arch, core, cpumodel} = system.cpu;
    const {memory, usedmem, usepercent} = system.memory;
    const OStype = system.OStype;
    const usedmemory = parseInt(usedmem) < parseInt(memory) ? usedmem + "G" : usedmem + "M";
    const {rss_, heapTotal_, heapUsed_} = system.processmemory;
    const {start_time, recv_msg_cnt, sent_msg_cnt, msg_cnt_per_min} = this_.stat;
    let status: string | OnlineStatus = this_.status;
    switch (status) {
        case 11:
            status = "我在线上";
            break;
        case 31:
            status = "离开";
            break;
        case 41:
            status = "隐身";
            break;
        case 50:
            status = "忙碌";
            break;
        case 60:
            status = "Q我吧";
            break;
        case 70:
            status = "请勿打扰";
            break;
    }
    const msg_: any = [];
    msg_.push(segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${this_.uin}`));
    msg_.push(`昵称: ${this_.nickname}\n`);
    msg_.push(`性别: ${this_.sex}\n`);
    msg_.push(`状态: ${status}\n`);
    msg_.push(`收到消息总数: ${recv_msg_cnt}\n`);
    msg_.push(`发送消息总数: ${sent_msg_cnt}\n`);
    msg_.push(`每分钟数: ${msg_cnt_per_min}\n`);
    msg_.push(`系统架构: ${arch}\n`);
    msg_.push(`操作系统: ${OStype}\n`);
    // msg_.push(`cpu: ${cpumodel} ${core}核\n`);
    // msg_.push(`内存: ${usedmemory}/${memory}G ${usepercent}%\n`);
    msg_.push(`${"==================="}\n`);
    msg_.push(`${"进程占用"}\n`);
    msg_.push(`进程分配内存: ${rss_}M\n`);
    msg_.push(`堆分配内存: ${heapTotal_}M\n`);
    msg_.push(`堆使用内存: ${heapUsed_}M`);
    return msg_;
}

function cmdHanders(this: Client, cmd: string, params: string) {
    const cmd_ = params[0];
    const cmd__ = params[1];
    try {
        let msg = "";
        if (cmd === "详情") {
            return sys(this);
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
                        return pluginlist();
                    case "启用":
                        if (!cmd__)
                            return `没带参数?`;
                        return activate(cmd__, this);
                    case "禁用":
                        if (!cmd__)
                            return `没带参数?`;
                        return deactivate(cmd__, this);
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
            return reload(cmd_, this);
        }
        return 0;
    } catch (e: any) {
        return `error: ${e.message}`;
    }
}

/** create client🥥 */
(async function step() {
    process.on("uncaughtException", e => {
        console.log(e);
    });
    const bot = await client.create();
    bot.once('system.online', () => {
        bot.logger.mark('上线成功!');
        onlineActivity(bot);
        adminsEvents(bot);
        events(bot);
    });
})();


