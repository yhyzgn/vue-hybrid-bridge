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
        if (args.indexOf(" ") !== -1) {
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
        throw new Error("未知元素：" + args);
    }
}

Hybrid.fn = Hybrid.prototype = {
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
        Hybrid.addEvent(document, "DOMContentLoaded", function () {
            let mobile = Hybrid.browser.versions.mobile;
            if (mobile) {
                Hybrid.getConfig(function (data) {
                    if (Hybrid.urlParam("platform") === data.platform) {
                        fn(mobile, Hybrid.browser.versions.android, Hybrid.browser.versions.ios);
                    }
                })
            } else {
                fn();
            }
        });
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
    parent: function () {
        let element = this.elements[0].parentNode;
        if (null === element || typeof element === "undefined") {
            element = document;
        }
        this.elements = [];
        this.elements.push(element);
        return this;
    },
    next: function () {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i] = this.elements[i].nextSibling;
            if (null === this.elements[i]) {
                throw new Error("没有下一个同级元素");
            }
            if (this.elements[i].nodeType === 3) {
                this.next();
            }
        }
        return this;
    },
    prev: function () {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i] = this.elements[i].previousSibling;
            if (null === this.elements[i]) {
                throw new Error("没有下一个同级元素");
            }
            if (this.elements[i].nodeType === 3) {
                this.prev();
            }
        }
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
            Hybrid.addEvent(this.elements[i], type, fn);
        }
        return this;
    },
    click: function (fn) {
        return this.on("click", fn);
    },
    attr: function (attr, value) {
        if (arguments.length === 1) {
            if (typeof arguments[0] === "object") {
                // 设置attr
                for (let i = 0; i < this.elements.length; i++) {
                    for (let key in arguments[0]) {
                        this.elements[i].setAttribute(key, arguments[0][key]);
                    }
                }
            } else {
                // 获取attr
                return this.elements[0].getAttribute(arguments[0]);
            }
        } else {
            // 设置attr
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(attr, value);
            }
        }
        return this;
    },
    css: function (attr, value) {
        if (arguments.length === 1) {
            if (typeof arguments[0] === "object") {
                // 设置css
                for (let i = 0; i < this.elements.length; i++) {
                    for (let key in arguments[0]) {
                        this.elements[i].style[key] = arguments[0][key];
                    }
                }
            } else {
                // 获取css
                return Hybrid.getStyle(this.elements[0], arguments[0]);
            }
        } else {
            // 设置css
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].style[attr] = value;
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
            return Hybrid.text(this.elements[0]);
        }
        for (let i = 0; i < this.elements.length; i++) {
            Hybrid.text(this.elements[i], text);
        }
        return this;
    },
    show: function () {
        return this.css({display: "block"});
    },
    hide: function () {
        return this.css({display: "none"});
    },
    toggle: function () {
        for (let i = 0; i < this.elements.length; i++) {
            (function (element, args) {
                let count = 0;
                Hybrid.addEvent(element, "click", function () {
                    args[count++ % args.length].call(this);
                });
            })(this.elements[i], arguments);
        }
        return this;
    },
    handle: function (fn, args) {
        if (arguments.length < 1) {
            throw new Error("第一个参数必须与原生环境方法对应");
        }

        if (Hybrid.browser.versions.mobile) {
            // 移动端
            Hybrid.getConfig(function (data) {
                if (typeof args === "object") {
                    args = JSON.stringify(args);
                } else {
                    args = null;
                }

                if (Hybrid.browser.versions.android && typeof null !== data.bridge) {
                    if (window.app) {
                        fn.call(window.app, args);
                    } else {
                        let appEvt = document.createEvent("Events");
                        appEvt.initEvent(data.bridge, false, false);
                        Hybrid.addEvent(document, data.bridge, function () {
                            fn(args);
                        });
                        document.dispatchEvent(appEvt);
                    }
                } else if (Hybrid.browser.versions.ios) {
                    fn.call(window, args);
                }
            })
        } else {
            // PC端，直接执行方法即可
            fn.call(window, args);
        }
    },
    extend: function (extend) {
        if (arguments.length !== 1 || typeof extend !== "object") {
            throw new Error("原型扩展参数必须是对象格式");
        }
        for (let name in extend) {
            Hybrid.prototype[name] = extend[name];
        }
    },
}

/**
 * 插件扩展方法
 * @param obj 插件集
 */
Hybrid.plugins = function (obj) {
    if (arguments.length !== 1 || typeof obj !== "object") {
        throw new Error("插件集参数必须是对象格式");
    }

    for (let name in obj) {
        Hybrid[name] = obj[name];
    }
}

/**
 * 插件扩展
 */
Hybrid.plugins({
    browser: {
        versions: function () {
            const u = navigator.userAgent;
            return {// 移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, // IE内核
                presto: u.indexOf('Presto') > -1, // opera内核
                webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
                mobile: !!u.match(/Android|webOS|iPhone|iPod|BlackBerry/i), // 是否为移动终端
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
    init: function () {

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
    },
    getStyle: function (element, style) {
        if (typeof window.getComputedStyle !== "undefined") {
            return window.getComputedStyle(element, null)[style];
        } else if (typeof element.currentStyle !== "undefined") {
            return element.currentStyle[style];
        }
    },
    hasClass: function (element, className) {
        return element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    },
    getJson: function (url, callback) {
        Hybrid.ajax({
            url: url,
            type: "json",
            success: callback
        });
    },
    urlParam: function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let result = window.location.search.substr(1).match(reg);
        if (result != null) {
            return decodeURIComponent(result[2]);
        }
        return null;
    },
    ajax: function () {
        let url = "/";
        let method = "GET";
        let success = null;
        let error = null;
        let complete = null;

        let params = {};
        let form = null;
        let type = "text";

        if (arguments.length === 1) {
            // 对象格式
            if (typeof arguments[0] === "object") {
                let obj = arguments[0];
                url = typeof obj.url === "string" ? obj.url : url;
                method = typeof obj.method === "string" ? obj.method : method;
                success = typeof obj.success === "function" ? obj.success : null;
                error = typeof obj.error === "function" ? obj.error : null;
                complete = typeof obj.complete === "function" ? obj.complete : null;
                params = typeof obj.params === "object" ? obj.params : params;
                form = typeof obj.form === "object" ? obj.form : null;
                type = typeof obj.type === "string" ? obj.type : type;
            }
        } else if (arguments.length === 2) {
            if (typeof arguments[0] === "string" && typeof arguments[1] === "function") {
                url = arguments[0];
                success = arguments[1];
            }
        } else if (arguments.length === 3) {
            if (typeof arguments[0] === "string" && typeof arguments[1] === "function" && typeof arguments[2] === "function") {
                url = arguments[0];
                success = arguments[1];
                error = arguments[2];
            }
        } else if (arguments.length === 4) {
            if (typeof arguments[0] === "string" && typeof arguments[1] === "function" && typeof arguments[2] === "function" && typeof arguments[3] === "function") {
                url = arguments[0];
                success = arguments[1];
                error = arguments[2];
                complete = arguments[3];
            }
        } else if (arguments.length === 5) {
            if (typeof arguments[0] === "string" && typeof arguments[1] === "string" && typeof arguments[2] === "function" && typeof arguments[3] === "function" && typeof arguments[4] === "function") {
                url = arguments[0];
                method = arguments[1];
                success = arguments[2];
                error = arguments[3];
                complete = arguments[4];
            }
        } else {
            throw new Error("参数错误");
        }

        let xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();//非IE6
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");//IE6
        }

        method = method.toUpperCase();
        type = type.toLowerCase();

        if (method !== "POST") {
            let urlParams = "";
            for (let name in params) {
                urlParams += "&" + name + "=" + params[name];
            }
            if (urlParams !== "") {
                if (url.indexOf("?") === -1 && url.indexOf("=") === -1) {
                    // 原始url中没有任何参数
                    urlParams = urlParams.replace(/^&/, "?");
                }
                url += urlParams;
            }
        }

        xhr.open(method, url, true);
        if (method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (null !== form) {
                params = Hybrid.formData(form);
            }
            xhr.send(Hybrid.serialize(params));
        } else {
            xhr.send();
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && success) {
                    let response = "";
                    if (type === "xml") {
                        response = xhr.responseXML;
                    } else if (type === "json") {
                        response = JSON.parse(xhr.responseText);
                    } else {
                        response = xhr.responseText;
                    }
                    success(response);
                } else {
                    if (error) {
                        error(xhr.status, xhr);
                    }
                }
                if (complete) {
                    complete(xhr);
                }
            }
        }
    },
    serialize: function (params) {
        if (typeof params !== "object") {
            throw new Error("序列化参数必须是对象格式");
        }

        if (params instanceof Array) {
            if (typeof FormData === "function") {
                let data = new FormData();
                for (let index in params) {
                    data.append(params[index].split("=")[0], params[index].split("=")[1]);
                }
                return data;
            } else {
                let data = [];
                for (let index in params) {
                    data.push(encodeURIComponent(params[index]));
                }
                return data.join("&");
            }
        } else {
            if (typeof FormData === "function") {
                let data = new FormData();
                for (let name in params) {
                    data.append(name, params[name]);
                }
                return data;
            } else {
                let data = [];
                for (let name in params) {
                    data.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
                }
                return data.join("&");
            }
        }
    },
    formData: function (form) {
        if (arguments.length !== 1 || typeof form !== "object") {
            throw new Error("格式化的表单不能为空");
        }

        let data = [];
        let item = null;
        let option = null;

        for (let i = 0; i < form.elements.length; i++) {
            item = form.elements[i];
            switch (item.type) {
                case "select-one":
                case"select-multiple":
                    if (item.name.length > 0) {
                        for (let j = 0; j < item.options.length; j++) {
                            option = item.options[j];
                            if (option.selected) {
                                data.push(item.name + "=" + option.value);
                            }
                        }
                    }
                    break;
                case undefined:
                case"file":
                case"submit":
                case"reset":
                case"button":
                    break;
                case"radio":
                case"checkbox":
                    if (!item.checked) {
                        break;
                    }
                default:
                    if (item.name.length > 0) {
                        data.push(item.name + "=" + item.value);
                    }
                    break;
            }
        }
        return data;
    },
    configUrl: function () {
        let elements = document.getElementsByTagName("script");
        if (typeof elements !== "undefined") {
            let src = null;
            let configUrl = null;
            for (let i = 0; i < elements.length; i++) {
                src = elements[i].getAttribute("src");
                if (typeof src === "string") {
                    configUrl = elements[i].getAttribute("config");
                    src = src.indexOf("?") ? src.substring(0, src.indexOf("?")) : src;
                    if (typeof configUrl !== "undefined" && new RegExp(src + "$").test("hybrid.js")) {
                        return configUrl;
                    }
                }
            }
        }
        return "hybrid/config.json";
    },
    getConfig: function (fn) {
        Hybrid.getJson(Hybrid.configUrl(), fn);
    }
});

window.Hy = Hybrid;
window.hy = hy;
if (typeof window.$ === "undefined") {
    window.$ = window.hy;
}