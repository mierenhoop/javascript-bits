/**
 * Alias for `document.querySelector`.
 * @param {string} s 
 * @returns {HTMLElement | null}
 */
function $(s) {
    return document.querySelector(s);
}

/**
 * Encode the contents of a form element for use as POST payload.
 * Only supported by modern browsers.
 * @param {HTMLFormElement} form 
 * @returns {URLSearchParams}
 */
function encForm(form) {
    // @ts-ignore
    return new URLSearchParams(new FormData(form));
}

/**
 * Encode form inputs into query string.
 * IE8+ compatible.
 * @param {HTMLFormElement} form element which contains
 * @param {(string | [string, string])[]} keys array of either name attributes for input elements or 
 * @returns {string} query string
 */
function _encForm(form, keys) {
    var fields, key, s = "";
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        if (typeof key == "string")
            fields = form.querySelectorAll("[name=\"" + key + "\"]");
        else
            key = key[0], fields = [{ value: key[1] }];
        for (var j = 0; j < fields.length; j++) { // @ts-ignore
            s += (i + j ? "&" : "?") + encodeURIComponent(key) + "=" + encodeURIComponent(fields[i].value);
        }
    }
    return s;
}

/**
 * @typedef Context
 * @type {object}
 * @property {XMLHttpRequest} xhr
 * @property {HTMLElement | null} el
 * @property {((f: ((ctx: Context) => void) | undefined) => void)} call
 */

/**
 * Swap element with response from request.
 * IE7+ compatible.
 * @param {string | [string, XMLHttpRequestBodyInit]} req
 * request URL, optionally prefixed with request method like in HTTP
 * @param {HTMLElement | null} target target element,
 * if target element is null, the swap callback will still be fired if existant.
 * @param {"outerHTML" | "innerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend" | "delete" |"none" } [swapMethod]
 * what to do with received element, in the case of the callback, swapping should be done manually.
 * default is "innerHTML".
 * @param {((ctx: Context) => void)} [f]
 */
function swap(req, target, swapMethod, f) {
    var data;
    if (typeof req == "object")
        data = req[1], req = req[0];
    if (!swapMethod) swapMethod = "innerHTML";
    var xhr = new XMLHttpRequest();
    var s = req.split(" ");
    xhr.open(s[1] ? s[0] : "GET", s[1] || s[0]);
    xhr.onload = function () {
        /** @type {Context} */
        var ctx = {
            xhr: xhr,
            el: target,
            call: function (f) {
                if (f) f(this);
                else if (this.el) { // @ts-ignore
                    if (swapMethod.match("(inner|outer)HTML")) // @ts-ignore
                        this.el[swapMethod] = this.xhr.responseText; // @ts-ignore
                    else if (swapMethod.match("(after|before)(begin|end)")) // @ts-ignore
                        this.el.insertAdjacentHTML(swapMethod, this.xhr.responseText);
                    else if (swapMethod == "delete" && this.el.parentNode)
                        this.el.parentNode.removeChild(this.el);
                }
            },
        };
        ctx.call(f);
    };
    xhr.send(data);
}

/**
 * Do not continue if request was not successful.
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function nothingIfError(f) {
    return function (ctx) {
        if (ctx.xhr.status != 200) return;
        ctx.call(f);
    };
}

/**
 * Wait a specified time before swapping.
 * @param {number} ms
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function delay(ms, f) {
    return function (ctx) {
        setTimeout(ctx.call, ms, f);
    };
}

/**
 * Add 'settling' class to target element for a specified time after swapping.
 * @param {number} ms
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useSettling(ms, f) {
    return function (ctx) {
        ctx.call(f);
        if (ctx.el) {
            ctx.el.classList.add("settling");
            setTimeout(ctx.el.classList.remove, ms, "settling");
        }
    };
}

/**
 * Add 'settling' class to target element for a specified time before swapping.
 * @param {number} ms
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useSwapping(ms, f) {
    return function (ctx) {
        if (ctx.el)
            ctx.el.classList.add("swapping");
        ctx.call(f);
        if (ctx.el)
            setTimeout(ctx.el.classList.remove, ms, "swapping");
    };
}

/**
 * Gives a class `indicator` to an element while a request is ongoing.
 * @param {HTMLElement|null} [el]
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useIndicator(el, f) {
    return function (ctx) {
        if (typeof el == "function") f = el, el = null;
        if (!el) el = ctx.el;
        if (el) el.classList.add("indicator");
        ctx.call(f);
        if (el) el.classList.remove("indicator");
    };
}

/**
 * Changes the document's title when the response contains a `title` tag.
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useTitle(f) {
    return function (ctx) {
        var parent = ctx.el && ctx.el.parentElement;
        ctx.call(f);
        if (parent) {
            var title = parent.querySelector("title");
            if (title) {
                if (title.textContent)
                    document.title = title.textContent; // @ts-ignore
                title.parentNode.removeChild(title);
            }
        }
    };
}

/**
 * Passes a header `Boost` with the request.
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useBoost(f) {
    return function (ctx) {
        ctx.xhr.setRequestHeader("Boost", "true");
        ctx.call(f);
    };
}
