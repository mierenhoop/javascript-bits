The file [bits.js](./bits.js) contains seperate functions that can be used anywhere.

## Generic functions

|Name|Description
|----|--------------------------
|`$`|Alias for `document.querySelector`, mimics the feel of jQuery.
|`encForm`|Encode values of input elements that usually get passed in a form submission into a URL query. Useful for manually sending requests.
|`_encForm`|Manual version of `encForm` supporting older browsers.

## HTMX-like functions

|Name|Description
|----|--------------------------
|`swap`|A function with the functionality of `hx-get`, `hx-post`, `hx-swap`, `hx-target` and more. Allows combining with functions to get other functionality. All other functions in this table are such combinator functions.
|`nothingIfError`|Do not swap if request status is not 200.
|`delay`|Wait a specified time before swapping.
|`useSettle`|Add 'settling' class to target element for a specified time after swapping.
|`useTitle`|Changes the document's title when the response contains a `title` tag.
