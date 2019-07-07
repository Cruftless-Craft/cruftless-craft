---
title:    "Passing data from twig to javascript"
heading:  "Passing data from<br/> Twig to JavaScript"
desc:     "I'm just going to spoil it for you... the trick is to use data attributes... but there's more!"
cover:    "cover-passing-data-from-twig-to-javascript.svg"
facebook: "facebook-passing-data-from-twig-to-javascript.png"
twitter:  "facebook-passing-data-from-twig-to-javascript.png"
date:     "1 August 2018 22:34 UTC"
author:   "Ben Rogerson"
---

<div class="intro">As fantastic as Twig is, some things can’t be done without a little help from JavaScript</div>

##Using a data attribute to pass a single field

If you have a small amount of data to share with JavaScript then use a named data attribute.

First add the named data attribute to an element.<br> I often need it within a loop like this:

```twig
{# Add a custom named data attribute containing your data #}
{% for entry in entries %}
    <a href="{{ entry.link }}" data-entry-id="{{ entry.id }}">
        {{ entry.title }}
    </a>
{% endif %}
```

**❗ If the value has a chance of containing a `"` or `<` then add an escape filter: `...|e('html_attr')`.**

Then in JavaScript, select the elements by their data attribute and extract the value from their dataset to get an array of values:

```js
/**
 * Grab data attributes with vanilla JavaScript (ES6)
 */
document.addEventListener('DOMContentLoaded', () => {

    // Select elements by their data attribute
    const entryElements =
        document.querySelectorAll('[data-entry-id]');

    // Map over each element and extract the data value
    const entryIds =
        Array.from(entryElements).map(
            item => item.dataset.entryId
        );

    // You'll now have an array containing string values
    console.log(entryIds); // eg: ["1", "2", "3"]
});

/**
 * Grab data attributes with JQuery
 */
$(() => {

    // Select elements by their data attribute
    const $entryElements = $('[data-entry-id]');

    // Map over each element and extract the data value
    const $entryIds =
        $.map($entryElements, item => $(item).data('entryId'));

    // You'll now have array containing string values
    console.log($entryIds); // eg: ["1", "2", "3"]
});
```

**❗ Any data attributes with hypens added after the `data-` prefix convert to camelCase within their dataset. eg: `data-entry-id=...` converts to `entryId`**

For more information on data attributes take a look at the MDN docs guide on [using data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

##Using a data attribute to pass multiple fields

The keep our code clean, we’ll use a slightly different tactic to send multiple pieces of data to JavaScript.

The trick is to create an object in Twig, convert the data to JSON then select it with JavaScript:

```twig
{# Create an object containing your data #}
{% set entryInfo = {
    id: entry.id,
    title: entry.title,
    subheading: entry.showSub ? entry.subheading : null,
} %}

{# Convert the object to JSON, replace the single quotes
and convert to raw.
Be sure to use single quotes around the raw content. #}
<div data-entry-info='{{ entryInfo|json_encode|replace("'", "&#39;")|raw }}'>
    ...
</div>
```
Then in JavaScript, select the elements by their data attribute and `JSON.parse` each dataset value to get an array of objects:

```js
/**
 * Grab data attribute objects with vanilla JavaScript (ES6)
 */
document.addEventListener('DOMContentLoaded', () => {

    // Select elements by their data attribute
    const entryInfoElements =
        document.querySelectorAll('[data-entry-info]');

    // Map over each element and extract the data value
    const entryInfoObjects =
        Array.from(entryInfoElements).map(
            item => JSON.parse(item.dataset.entryInfo)
        );

    // You'll now have an array of objects to work with
    console.log(entryInfoObjects);
    // eg: [{id: 1, subheading: "...", title: "..."}]
});

/**
 * Grab data attribute objects with JQuery
 */
$(() => {

    // Select elements by their data attribute
    const $entryInfoElements = $('[data-entry-info]');

    // Map over each element and extract the data value
    const $entryInfoObjects =
        $.map($entryInfoElements, item => $(item).data('entryInfo'));

    // You'll now have array of objects to work with
    console.log($entryInfoObjects); // eg: [{id: 1, subheading: "...", title: "..."}]
});
```

###Why we use the raw filter

When we convert the object above to JSON it looks like this:

```html
<!-- After using |json_encode -->
{&quot;id&quot;:1,&quot;title&quot;:&quot;...&quot;,&quot;subheading&quot;:&quot;...&quot;}
```

The [twig documentation for escape](https://twig.symfony.com/doc/2.x/filters/escape.html) shows we can use `|e('html_attr')` to escape instead of `|raw`. It allows us to use double quotes around the value in our Twig but it creates a large amount of unneeded code:

```html
<!-- After using |json_encode|e('html_attr') -->
&#x7B;&quot;id&quot;&#x3A;1,&quot;title&quot;&#x3A;&quot;...&quot;,&quot;subheading&quot;&#x3A;&quot;...&quot;&#x7D;
```

The `raw` filter prunes the JSON object down but now requires single quotes to attach it to the data attribute because it uses double quotes within the object:

```html
<!-- After using |json_encode|replace("'", "&#39;")|raw  -->
{"id":1,"title":"...","subheading":"..."}

<!-- This is why the data attribute is single quoted: -->
<div
    data-entry-info='{"id":1,"title":"...","subheading":"..."}'
>...</div>
```

##Add the data within a script tag

If you have general data that’s not directly tied to an item then creating a JavaScript variable within a script tag can be a good option:

```twig
<script>

    // Create an object for your data
    var entryInfo = {
        id: '{{ entry.id }}',
        title: '{{ entry.title|e('js') }}',
        subheading: '{{ entry.showSub ? entry.subheading|e('js') : null }}',
    };

    // Or create a single variable
    var entryTitle = '{{ entry.title|e('js') }}'

</script>
```
Then simply grab the variable from the browsers window object within JavaScript:

```js
document.addEventListener('DOMContentLoaded', () => {

    // Get the object from the window object
    const entryInfo = window.entryInfo;

    // Now you have a JavaScript object
    console.log(entryInfo);
});
```

##TL;DR

###For data that’s related to an element

- **If you have a single field of data**<br>Use a named data attribute, eg: `data-the-name="..."`.
- **If you have multiple fields of data**<br>Use a JSON encoded object and attach it to a data attribute.

###For generalised page data
Create a JSON encoded object or variable and place it within a script tag.


##Further reading

- For more information on data attributes take a look at the MDN docs guide on [using data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

- Check Twigs official documentation on [passing variables from twig to js](https://symfony.com/doc/current/frontend/encore/server-data.html).