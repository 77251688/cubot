import * as fs from "fs";
import * as path_ from "path";
import { Client } from "@cummins/oicq";
import { file } from "./utils";

const plugins = new Map<string, Plugin>();

class Plugin {
    name: string;
    path: string;
    fullpath: string;
    confpath: string;
    constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
        this.fullpath = require.resolve(this.path);
        this.confpath = path_.join(__dirname, "../", "config.json");
        require(this.path);
    }
    editPluginCache(method: "add" | "delete") {
        let set: Set<string>;
        const config_ = file.returnFile(this.confpath);
        try {
            const { plugins } = config_;
            set = new Set(plugins);
        }
        catch (e) {
            set = new Set();
        }
        set[method](this.name);
        config_.plugins = Array.from(set);
        file.writeFile(this.confpath, config_);

    }
    activate(bot: Client) {
        const mod = require.cache[this.fullpath];
        if (typeof mod?.exports.enable !== "function") {
            throw new Error("❌该插件未导出enable方法,无法启用!");
        }
        this.editPluginCache("add");
        mod.exports.enable(bot);
        return "✅启用成功";

    }
    deactivate(name: string, bot: Client) {
        const mod = require.cache[this.fullpath];
        if (typeof mod?.exports.disable !== "function") {
            throw new Error("❌该插件未导出disable方法,无法禁用!");
        }
        if(typeof mod?.exports.gc ==="function"){
            mod?.exports.gc();
        }
        mod.exports.disable(bot);
        delete require.cache[this.fullpath];
        plugins.delete(name);
        this.editPluginCache("delete");
        return "✅禁用成功";
    }
}

function isImported(name: string) {
    if (!plugins.has(name))
        throw new Error("❌都没启用禁用个锤子");
    return plugins.get(name) as Plugin;
}

export function importPlugin(name: string) {
    if (plugins.has(name))
        throw new Error(`😅该插件已启用`);
    let res = "";
    const files = fs.readdirSync(path_.join(__dirname, "../", "plugin"));
    if (files.includes(name)) {
        res = path_.join(__dirname, "../plugin", name);
    }
    if (!res)
        throw new Error(`❌无法找到此插件: ${name}`);
    const plugin = new Plugin(name, res);
    plugins.set(name, plugin);
    return plugin;
}

export function activate(name: string, bot: Client) {
    const plugin = importPlugin(name);
    return plugin.activate(bot);
}

export function deactivate(name: string, bot: Client) {
    return isImported(name).deactivate(name, bot);
}

export function reload(name: string, bot: Client) {
    isImported(name).deactivate(name, bot);
    const plugin = importPlugin(name);
    plugin.activate(bot);
    return `${name}重载成功!`;
}

export function onlineActivate(bot: Client) {
    const { plugins } = file.returnFile(path_.join(__dirname, "../", "config.json"));
    const set = new Set(plugins);
    for (const e of plugins) {
        const plugin = importPlugin(e);
        plugin.activate(bot);
    }
    return set.size;
}

export function pluginlist() {
    const list = fs.readdirSync(path_.join(__dirname, "../", "plugin"));
    const { plugins } = file.returnFile(path_.join(__dirname, "../", "config.json"));
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