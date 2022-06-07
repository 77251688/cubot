"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
/**
 * 🤔😅🥰🥵🤨🥥🍇🍈🍋🍍🍪🍮🍹
 * 无规则命名法🥵🥰🥰🥰
 *
 */
async function aa(bot) {
    bot.on('message', (e) => {
        console.log(e);
    });
}
/** create a client🥥 */
(async function step() {
    const bot = await bot_1.client.create();
    bot.once('system.online', () => {
        bot.logger.mark('上线成功!');
        aa(bot);
    });
})();
