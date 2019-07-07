---
title:    "How to check for undefined variables"
heading:  "How to check for<br/> undefined variables"
cover:    "how-to-check-for-undefined-variables-cover.svg"
facebook: "how-to-check-for-undefined-variables-facebook.png"
twitter:  "how-to-check-for-undefined-variables-twitter.png"
date:     "24 July 2018 11:00 UTC"
updated:  "28 July 2018 09:10 UTC"
author:   "Ben Rogerson"
---

<div class="intro">
Everyone working with Twig templates has experienced an undefined error
</div>

```bash
=> Error: Variable 'blah' does not exist.
```

This error means <strong>you're trying to access a variable in your code that hasn’t been set</strong>.

There’s different ways in Twig to check for undefined variables so let’s get stuck in!

##Is defined

Starting with the most obvious choice. `is defined` checks if the variable is defined and nothing more.

```twig
{# Check a variable is defined #}
{% if twigVariable is defined %}
    The value could be:
    0, false, null, [], {} or ''
{% else %}
    Value is not defined
{% endif %}

{# Check a field is defined within an iterable #}
{% if twigVariable['fieldName'] is defined %}
...
```

##'default filter' with empty fallback

The [default filter](https://twig.symfony.com/doc/2.x/filters/default.html) is commonly used to display a fallback value within the brackets if the attached variable is undefined.

Eg: `twigVariable|default('this is the fallback')`

🔥 What the twig documentation doesn’t mention is that <strong>the filter fallback value can be empty</strong>.

- It’s ideal for checking if anything is empty, false or undefined
- It reads as `null` which means you can guard against undefined errors like this:

```twig
{# Check a variable with an empty default filter #}
{% if twigVariable|default %}
    Value is set and not empty
{% else %}
    Value is either undefined, false, 0, null, "", [] or {}
{% endif %}

{# or check a field within an iterable #}
{% if twigVariable['fieldName']|default %}
...
```

Sometimes it’s clearer to use ternary syntax and the default filter works well here too:

```twig
{# Check a variable with ternary default filter #}
{{ twigVariable|default
    ? 'Value is set and not empty'
    : 'Value is undefined, false, 0, null, "", [] or {}'
}}

{# or check a field within an iterable #}
{{ twigVariable['fieldName']|default ? 'set' : 'unset' }}
```

The `default` filter has the same checks as `is defined` combined with `is not empty`:

```twig
{# |default checks for the same things as: #}
{{ twigVariable is defined
    and twigVariable is not empty ? 'set' : 'unset' }}
```

##'default filter' with specified fallback

This is perfect for showing a value on screen with a fallback and with a minimal amount of code:

```twig
{{ twigVariable|default('twigVariable is not defined') }}
{# Checks value for undefined, false, null, "", [] or {}' #}
```
<strong>❗ But there’s an important difference compared to an empty default filter:</strong>

If twigVariable is set as `0` you won’t receive a fallback and it will return an empty string instead.

##Null coalescing operator

Let’s geek it up a notch 🤓 and learn about this rarely used but powerful operator.

The `??` operator is similar to `is defined` but has some handy additions.

You can quickly specify fallbacks if your variable is undefined.
It looks like this:

```twig
{# Check a variable with the null coalescing operator #}
{{ twigVariable ?? 'twigVariable not defined' }}

{# or check a field within an iterable #}
{{ twigVariable['fieldName'] ?? 'fieldName not defined' }}
```

The example above is the same as this longer `is defined` check:

```twig
{{ twigVariable is defined
    ? twigVariable
    : 'twigVariable not defined' }}
```

We can also add infinite fallbacks with more `??` conditions:

```twig
{{ twigVariable ?? fallbackVariable ?? 'Variables not defined' }}
```

Now compare the length of that short syntax with the equivalent using `is defined` in ternary:

```twig
{{ twigVariable is defined
    ? twigVariable
    : (fallbackVariable is defined
        ? fallbackVariable
        : 'twigVariable & fallbackVariable not defined'
    )
}}
```

Just for fun - your fallback can have a `|default` filter too. We can't chain fallbacks after the default filter because it acts like a 'catch all':

```twig
{{ twigVariable ?? fallbackVariable|default('No variables defined') }}
```

##If statement with null coalescing&nbsp;operator

We can also use a `??` within an 'if statement' to specify an instruction if `twigVariable` is undefined.

In this example, if `twigVariable` is undefined the test moves onto the next fallback. In this case it enters into the `{% else %}`:

```twig
{% if twigVariable ?? false %}
    The value is set and not empty
{% else %}
    Value is either undefined, false, 0, null, [] or {}
{% endif %}
```

##An improved null coalesce operator&nbsp;replacement

[nystudio107](https://nystudio107.com/) has released a Twig extension for Craft 3 that patches the somewhat limited checks of the null coalescing operator.

>The `???` Empty Coalescing operator is similar to the `??` null coalescing operator, but also ignores empty strings `""` and empty arrays `[]` as well.

Once you install and activate this plugin you’ll be able to use the `???` to solidly check for a suitable
fallback like this:

```twig
{{ twigVariable ??? fallbackVariable
    ??? 'Both variables either undefined, null, "" or {}' }}
```

Take a look at [Empty Coalesce plugin on Github](https://github.com/nystudio107/craft-emptycoalesce).

##A side note about strict variables in&nbsp;Craft&nbsp;CMS

In Craft CMS 3, there’s a setting in `config/general.php` called `devMode`. By default, when `devMode` is set to true, [YII_DEBUG gets set as true](https://github.com/craftcms/cms/blob/802054d5016bb78b09438b703d006a67721f4fe9/bootstrap/bootstrap.php#L182) and in-turn [strict_variables gets set as true](https://github.com/craftcms/cms/blob/279116ba4091edc67c92fcbbefc257bb4fe30335/src/web/View.php#L1547).

- If `strict_variables=false` (default)<br>
Twig won’t notify you about any undefined variables.
- If `strict_variables=true`<br>
Twig throws a runtime error for all undefined variables - `Variable "[name]" does not exist.`

Some prefer to turn this setting off during development but that’s not best practice. You should know about undefined errors as soon as possible. You wouldn’t want to stumble across a broken variable later on would you?

##Further reading

- Straight Up Craft has a reference sheet on [how to check if a variable or value exists using Twig](https://straightupcraft.com/articles/how-to-check-if-a-variable-or-value-exists-using-twig).
- nystudio107 deep dives into [defensive coding techniques to help handle errors](https://nystudio107.com/blog/handling-errors-gracefully-in-craft-cms).