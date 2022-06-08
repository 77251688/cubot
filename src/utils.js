"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systen = void 0;
const os = require("os");
// import * as 
class systen {
    /** systen */
    static system() {
        const sys = os.type();
        switch (sys) {
            case `Windows_NT`:
                return `windows`;
            case `Linux`:
                return `linux`;
            case `Darwin`:
                return `Mac`;
        }
    }
}
exports.systen = systen;
