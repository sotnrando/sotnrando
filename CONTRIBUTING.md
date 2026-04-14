Style guidelines
---

* Limit of 80 characters per line

* Use 2-space indents

* Do not use tab characters for spacing

* Use single quotes for strings

* Do not terminate lines with semicolons

* Constant names are SNAKE_CASE in all caps

* All other names are camelCased

* Comments are placed on the line above the code they are commenting on

* Comments are complete english sentences with proper capitalization and grammar

* Place single space between keywords and parens:

```
if (condition) { // Yes
}
if(condition){   // No
}
```

* Place single space between list elements:

```
someFunctionCall(1, 2, 3) // Yes
someFunctionCall(1,2,3)   // No


* Always use curly parens for conditions, even if block is only a single line:

```
if (condition) {
  return              // Yes
}
if (condition) return // No
```

* Collapse parens and conditions to the same line:

```
if (condition) { // Yes
}
if (condition)
{                // No
}
```

* Use lowercase for hardcoded hex constants

* Always add trailing commas for arguments or elements in multi-line statements:

```
const someArray = [
  one,
  two,
  three,
]
someFunctionCall(
  one,
  two,
  three,
)
```
