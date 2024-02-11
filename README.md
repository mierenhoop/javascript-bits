The file [bits.js](./bits.js) contains seperate functions that can be used anywhere. You are free to modify each to your needs, as they contain no shared state.

## Functions

<!--tablestart-->
Name|Description
----|-----------
|`$`|Alias for `document.querySelector`, mimics the feel of jQuery. 
|`encForm`|Encode the contents of a form element for use as POST payload. Useful for manually sending requests. 
|`_encForm`|Manual version of `encForm` supporting older browsers. 
|`swap`|A function with the functionality of `hx-get`, `hx-post`, `hx-swap`, `hx-target` and more. Allows combining with functions to get other functionality. All following functions are such combinator functions. They are meant to be used with this `swap` function, so modifying the `swap` function might have a negative impact on their functionality. 
|`nothingIfError`|Do not swap if request was not successful. 
|`delay`|Wait a specified time before swapping. 
|`useSettling`|Add 'settling' class to target element for a specified time after swapping. 
|`useSwapping`|Add 'settling' class to target element for a specified time before swapping. 
|`useIndicator`|Add `indicator` class to an element or target while a request is ongoing. 
|`useTitle`|Changes the document's title when the response contains a `title` tag. 
|`useBoost`|Passes a header `Boost: true` with the request. 
<!--tablestop-->

### Example usage

#### Click to Edit

The original HTMX solution:
```html
<div hx-target="this" hx-swap="outerHTML">
    <div><label>First Name</label>: Joe</div>
    <div><label>Last Name</label>: Blow</div>
    <div><label>Email</label>: joe@blow.com</div>
    <button hx-get="/contact/1/edit" class="btn btn-primary">
    Click To Edit
    </button>
</div>
```

Made with the swap function:
```html
<div>
    <div><label>First Name</label>: Joe</div>
    <div><label>Last Name</label>: Blow</div>
    <div><label>Email</label>: joe@blow.com</div>
    <button onclick='swap("GET /contact/1/edit", this.parentNode, "outerHTML")' class="btn btn-primary">
    Click To Edit
    </button>
</div>
```

The returned form in HTMX:
```html
<form hx-put="/contact/1" hx-target="this" hx-swap="outerHTML">
  <div>
    <label>First Name</label>
    <input type="text" name="firstName" value="Joe">
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" name="lastName" value="Blow">
  </div>
  <div class="form-group">
    <label>Email Address</label>
    <input type="email" name="email" value="joe@blow.com">
  </div>
  <button class="btn">Submit</button>
  <button class="btn" hx-get="/contact/1">Cancel</button>
</form>
```

And ours:
```html
<form onsubmit='return !!swap(["PUT /contact/1", encForm(this)], this, "outerHTML")'>
  <div>
    <label>First Name</label>
    <input type="text" name="firstName" value="Joe">
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" name="lastName" value="Blow">
  </div>
  <div class="form-group">
    <label>Email Address</label>
    <input type="email" name="email" value="joe@blow.com">
  </div>
  <button class="btn">Submit</button>
  <button class="btn" onclick='return !!swap("/contact/1", this.form, "outerHTML")'>Cancel</button>
</form>
```
Note: the `return !!...` is a trick to return false so that the usual form action will not be triggered.

