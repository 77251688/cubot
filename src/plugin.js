"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginlist = exports.onlineActivate = exports.reload = exports.deactivate = exports.activate = exports.importPlugin = void 0;
const fs = require("fs");
const path_ = require("path");
const utils_1 = require("./utils");
const plugins = new Map();
class Plugin {
    name;
    path;
    fullpath;
    confpath;
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.fullpath = require.resolve(this.path);
        this.confpath = path_.join(__dirname, "../", "config.json");
        require(this.path);
    }
    editPluginCache(method) {
        let set;
        const config_ = utils_1.file.returnFile(this.confpath);
        try {
            const { plugins } = config_;
            set = new Set(plugins);
        }
        catch (e) {
            set = new Set();
        }
        set[method](this.name);
        config_.plugins = Array.from(set);
        utils_1.file.writeFile(this.confpath, config_);
    }
    activate(bot) {
        const mod = require.cache[this.fullpath];
        if (typeof mod?.exports.enable !== "function") {
            throw new Error("❌该插件未导出enable方法,无法启用!");
        }
        this.editPluginCache("add");
        mod.exports.enable(bot);
        return "✅启用成功";
    }
    deactivate(name, bot) {
        const mod = require.cache[this.fullpath];
        if (typeof mod?.exports.disable !== "function") {
            throw new Error("❌该插件未导出disable方法,无法禁用!");
        }
        mod.exports.disable(bot);
        delete require.cache[this, this.fullpath];
        plugins.delete(name);
        this.editPluginCache("delete");
        return "✅禁用成功";
    }
}
function isImported(name) {
    if (!plugins.has(name))
        throw new Error("❌都没启用禁用个锤子");
    return plugins.get(name);
}
function importPlugin(name, bot) {
    if (plugins.has(name))
        throw new Error(`😅该插件已启用`);
    let res = "";
    const files = fs.readdirSync(path_.join(__dirname, "../", "plugin"));
    // if (files.length === 0)
    //     throw new Error("0");
    if (files.includes(name)) {
        res = path_.join(__dirname, "../plugin", name);
    }
    if (!res)
        throw new Error(`❌无法找到此插件: ${name}`);
    const plugin = new Plugin(name, res);
    plugins.set(name, plugin);
    return plugin;
}
exports.importPlugin = importPlugin;
function activate(name, bot) {
    const plugin = importPlugin(name, bot);
    return plugin.activate(bot);
}
exports.activate = activate;
function deactivate(name, bot) {
    return isImported(name).deactivate(name, bot);
}
exports.deactivate = deactivate;
function reload(name, bot) {
    isImported(name).deactivate(name, bot);
    const plugin = importPlugin(name, bot);
    plugin.activate(bot);
    return `${name}重载成功!`;
}
exports.reload = reload;
function onlineActivate(bot) {
    const { plugins } = utils_1.file.returnFile(path_.join(__dirname, "../", "config.json"));
    const set = new Set(plugins);
    for (const e of plugins) {
        const plugin = importPlugin(e, bot);
        plugin.activate(bot);
    }
    return set.size;
}
exports.onlineActivate = onlineActivate;
function pluginlist() {
    const list = fs.readdirSync(path_.join(__dirname, "../", "plugin"));
    const { plugins } = utils_1.file.returnFile(path_.join(__dirname, "../", "config.json"));
    const set = new Set(plugins);
    let msg = "";
    list.forEach((e, index) => {
        let n = null;
        if (index < list.length) {
            n = "\n";
        }
        if (set.has(e)) {
            msg += `●${e}${n}`;
        }
        else {
            msg += `○${e}${n}`;
        }
    });
    return msg;
}
exports.pluginlist = pluginlist;
