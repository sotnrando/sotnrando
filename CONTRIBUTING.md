Style guidelines
---

* Limit of 80 characters per line

* Use 2-space indents

* Use single quotes for strings

* Do not terminate lines with semicolons

* Place single space between keywords and parens:

```
if (condition) { // Yes
}
if(condition){   // No
}
```

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
