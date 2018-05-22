/**
 * @author  : 颜洪毅
 * @e-mail  : yhyzgn@gmail.com
 * @version : 1.0.0
 * @date    : 2018-05-22 19:37
 * @desc    : 混合开发相关js脚本
 */

function hy(args) {
    return new Hybrid(args);
}

function Hybrid(args) {
    if (typeof args === "undefined") {
        args = window;
    }

    this.elements = [];

    if (typeof args === "object" && args !== undefined) {
        this.elements.push(args);
    } else if (typeof args === "function") {
        this.ready(args);
    } else if (typeof args === "string") {
        if (args.indexOf(' ') !== -1) {
            // CSS选择器
            const elements = args.split(" ");
            let children = [];
            let parents = [];
            let temps = [];
            for (let i = 0; i < elements.length; i++) {
                children = [];
                if (parents.length === 0) {
                    parents.push(document);
                }
                switch (elements[i].charAt(0)) {
                    case '#':
                        children.push(this.getById(elements[i].substring(1)));
                        break;
                    case '.':
                        for (let j = 0; j < parents.length; j++) {
                            temps = this.getByClass(elements[i].substring(1), parents[j]);
                            for (let k = 0; k < temps.length; k++) {
                                children.push(temps[k]);
                            }
                        }
                        break;
                    default:
                        for (let j = 0; j < parents.length; j++) {
                            temps = this.getByTag(elements[i], parents[j]);
                            for (let k = 0; k < temps.length; k++) {
                                children.push(temps[k]);
                            }
                        }
                        break;
                }
                parents = children;
            }
            this.elements = children;
        } else {
            // 普通选择器
            switch (args.charAt(0)) {
                case '#':
                    this.elements.push(this.getById(args.substring(1)));
                    break;
                case '.':
                    this.elements = this.getByClass(args.substring(1));
                    break;
                default:
                    this.elements = this.getByTag(args);
                    break;
            }
        }
    } else {
    }
}

Hybrid.prototype = {
    getById: function (id) {
        return document.getElementById(id);
    },
    getByClass: function (className, parent) {
        const temps = [];
        if (parent === undefined) {
            parent = document;
        }
        const alls = this.getByTag("*", parent);
        for (let i = 0; i < alls.length; i++) {
            if ((new RegExp("(\\s|^)" + className + "(\\s|$)")).test(alls[i].className)) {
                temps.push(alls[i]);
            }
        }
        return temps;
    },
    getByTag: function (tag, parent) {
        if (parent === undefined) {
            parent = document;
        }
        return parent.getElementsByTagName(tag);
    },
    find: function (arg) {
        let children = [];
        let temps = [];
        for (let i = 0; i < this.elements.length; i++) {
            switch (arg.charAt(0)) {
                case '#':
                    children.push(this.getById(arg.substring(1)));
                    break;
                case '.':
                    temps = this.getByClass(arg.substring(1), this.elements[i]);
                    for (let j = 0; j < temps.length; j++) {
                        children.push(temps[j]);
                    }
                    break;
                default:
                    temps = this.getByTag(arg, this.elements[i]);
                    for (let j = 0; j < temps.length; j++) {
                        children.push(temps[j]);
                    }
                    break;
            }
        }
        this.elements = children;
        return this;
    },
    ready: function (fn) {
        Hybrid.tools.addEvent(document, "DOMContentLoaded", fn);
        return this;
    },
    length: function () {
        return this.elements.length;
    },
    first: function () {
        return this.get(0);
    },
    last: function () {
        return this.get(this.length() - 1);
    },
    get: function (index) {
        if (index < 0 || index >= this.length()) {
            return null;
        }
        if (index === undefined) {
            index = 0;
        }
        const element = this.elements[index];
        this.elements = [];
        this.elements.push(element);
        return this;
    },
    eq: function (index) {
        if (index < 0 || index >= this.length()) {
            return null;
        }
        if (index === undefined) {
            index = 0;
        }
        return this.elements[index];
    },
    on: function (type, fn) {
        for (let i = 0; i < this.elements.length; i++) {
            Hybrid.tools.addEvent(this.elements[i], type, fn);
        }
        return this;
    },
    click: function (fn) {
        return this.on("click", fn);
    },
    attr: function (attr, value) {
        for (let i = 0; i < this.elements.length; i++) {
            if (arguments.length === 1) {
                return this.elements[i].getAttribute(attr);
            } else if (arguments.length === 2) {
                this.elements[i].setAttribute(attr, value);
            }
        }
        return this;
    },
    index: function () {
        let siblings = this.elements[0].parentNode.children;
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] === this.elements[0]) {
                return i;
            }
        }
        return -1;
    },
    value: function (value) {
        if (value === undefined) {
            return this.elements[0].value;
        }
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].value = value;
        }
        return this;
    },
    html: function (html) {
        if (html === undefined) {
            return this.elements[0].innerHTML;
        }
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = html;
        }
        return this;
    },
    text: function (text) {
        if (text === undefined) {
            return Hybrid.tools.text(this.elements[0]);
        }
        for (let i = 0; i < this.elements.length; i++) {
            Hybrid.tools.text(this.elements[i], text);
        }
        return this;
    },
    extend: function (extend) {
        if (arguments.length !== 1 || typeof extend !== "object") {
            throw new Error("原型扩展必须是对象格式");
        }
        for (let name in extend) {
            Hybrid.prototype[name] = extend[name];
        }
    }
}

/**
 * 一些工具方法
 * @type 工具
 */
Hybrid.tools = {
    browser: {
        versions: function () {
            const u = navigator.userAgent;
            return {// 移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, // IE内核
                presto: u.indexOf('Presto') > -1, // opera内核
                webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, // 是否iPad
                webApp: u.indexOf('Safari') === -1,// 是否web应该程序，没有头部与底部
                google: u.indexOf('Chrome') > -1 // Google浏览器
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    },
    addEvent: function (element, type, fn) {
        if (typeof element.addEventListener !== "undefined") {
            element.addEventListener(type, fn, false);
        }
    },
    text: function (element, text) {
        if (text === undefined) {
            return (typeof element.textContent === "string") ? element.textContent : element.innerText;
        } else {
            if (typeof element.textContent === 'string') {
                element.textContent = text;
            } else {
                element.innerText = text;
            }
        }
    }
}

window.hy = hy;
if (typeof window.$ === "undefined") {
    window.$ = window.hy;
}