```js
/**
 * Alias for `document.querySelector`.
 * @param {string} s 
 * @returns {HTMLElement | null}
 */
function $(s) {
    return document.querySelector(s);
}
```
```js
function $(e){return document.querySelector(e)}
```
```js
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
```
```js
function encForm(n){return new URLSearchParams(new FormData(n))}
```
```js
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
```
```js
function _encForm(a,l){for(var o,e,t="",n=0;n<l.length;n++){e=l[n],typeof e=="string"?o=a.querySelectorAll('[name="'+e+'"]'):(e=e[0],o=[{value:e[1]}]);for(var r=0;r<o.length;r++)t+=(n+r?"&":"?")+encodeURIComponent(e)+"="+encodeURIComponent(o[n].value)}return t}
```
```js
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
```
```js
function swap(i,r,e,f){var l;typeof i=="object"&&(l=i[1],i=i[0]),e||(e="innerHTML");var t=new XMLHttpRequest,n=i.split(" ");t.open(n[1]?n[0]:"GET",n[1]||n[0]),t.onload=function(){var a={xhr:t,el:r,call:function(s){s?s(this):this.el&&(e.match("(inner|outer)HTML")?this.el[e]=this.xhr.responseText:e.match("(after|before)(begin|end)")?this.el.insertAdjacentHTML(e,this.xhr.responseText):e=="delete"&&this.el.parentNode&&this.el.parentNode.removeChild(this.el))}};a.call(f)},t.send(l)}
```
```js
/**
 * Do not continue if request was not successful.
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function nothingIfError(f) {
    return function (ctx) {
        if (ctx.xhr.status != 200) return;
        ctx.call(f);
    }
}
```
```js
function nothingIfError(r){return function(n){n.xhr.status==200&&n.call(r)}}
```
```js
/**
 * Wait a specified time before swapping.
 * @param {number} ms
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function delay(ms, f) {
    return function (ctx) {
        setTimeout(ctx.call, ms, f);
    }
}
```
```js
function delay(n,t){return function(e){setTimeout(e.call,n,t)}}
```
```js
/**
 * Add 'settling' class to target element for a specified time after swapping.
 * @param {number} ms
 * @param {((ctx: Context) => void)} [f]
 * @returns {(ctx: Context) => void}
 */
function useSettle(ms, f) {
    return function (ctx) {
        ctx.call(f);
        if (ctx.el) {
            ctx.el.classList.add("settling");
            setTimeout(ctx.el.classList.remove, ms, "settling");
        }
    }
}
```
```js
function useSettle(l,s){return function(e){e.call(s),e.el&&(e.el.classList.add("settling"),setTimeout(e.el.classList.remove,l,"settling"))}}
```
```js
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
    }
}
```
```js
function useTitle(r){return function(n){var t=n.el&&n.el.parentElement;if(n.call(r),t){var e=t.querySelector("title");e&&(e.textContent&&(document.title=e.textContent),e.parentNode.removeChild(e))}}}
```
