# jscss

Compiler tool for creating CSS files by incorporating inline Javascript.

## JUSTIFICATION

The goal of JSCSS is to allow users to create CSS files with lots of speed and flexibility. It is similar to Sass in this way. However, JSCSS uses JavaScript syntax for all of it's extended functionality beyond vanilla CSS. In a finished state, it would be able to utilize both CSS and JavaScript code/libraries.

## SETUP

Install Node.js [here](https://nodejs.org/en/download/) or via command line.

  Bash: 
  ```
  curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
  ```
  Powershell: 
  ```
  winget install OpenJS.NodeJS
  ```

Other JavaScript runtimes should be able to run the compiler but I recommend Node.js.

## USAGE

The compiler can be run with `node jscss.js <input-filename>`.
The input file must have the extension `.jscss`, and the compiler will create a CSS output file in the root directory with the same name as the input file. 

In an input file, `$` represents the start and end of a code block. Below is a sample of what a `.jscss` file could look like. See the examples directory for more.
```
body {
    text-align: center;
}
    
h1.double {
    border-width: $10*20/50$px;
    border-style: double;
    Border-color: green
}
    
h1.double2 {
    border-width: $1+1$px;
    border-style: double;
    Border-color: green
}

h1.double3 {
    border-width: 15px;
    border-style: double;
    Border-color: green
}
```

would compile to:

```
body {
    text-align: center;
}
    
h1.double {
    border-width: 4px;
    border-style: double;
    Border-color: green
}
    
h1.double2 {
    border-width: 2px;
    border-style: double;
    Border-color: green
}
$log "howdy"$
h1.double3 {
    border-width: 15px;
    border-style: double;
    Border-color: green
}
```

and would also print "howdy" to the console.

## CURRENT STATE OF IMPLEMENTATION

For examples of JSCSS files that work for the current implementation, check `/currentExamples`. To see the grammar and details for what the finished implementation of this project would look like, it's in the next section.

### Quirks

Since the project is unfinished, there are some minor issues I'll cover here. First off, CSS files generated by the compiler have unnecessary newlines in places where a code block is used outside of a piece of CSS. Secondly, despite allowing typical JavaScript blocks, nesting, etc., the scope of every piece of code is always global. 

Most critically, the current implementation does not parse any CSS, and doesn't validate whether or not it's valid. There is also virtually no error handling for the JavaScript portion either.

### Grammar

- jscss -> chunk* EOF
- chunk -> cssBlock* | codeBlock*

***Note that a ccsBlock can include any CSS syntax with the exception of any use of "$". A cssBlock also does not have to be standalone valid CSS, since codeBlocks can exist within CSS classes, properties, etc., splitting what would be a valid block of CSS standalone.***

- codeBlock -> "$" declaration* "$"
- declaration -> letDecl | statement
- letDecl -> "let" IDENTIFIER ("=" expression)? endOfStatement
- statement -> expressionStatement | ifStatement | logStatement | whileStatement | block
- endOfStatement -> (";") | NEWLINE
- expressionStatement -> expression endOfStatement
- ifStatement -> "if" "(" expression ")" statement ("else" statement)?
- logStatement -> "log" expression endOfStatement
- whileStatement -> "while" "(" expression ")" statement
- block -> "{" declaration* "}"
- expression -> assignment
- assignment -> (IDENTIFIER "=" assignment) | logicalOr
- logicalOr -> logicalAnd ("||" logicalAnd)*
- logicalAnd -> equality ("&&" equality)*
- equality -> comparison (equalityOperator comparison)*
- equalityOperator -> "!=" | "=="
- comparison -> term (comparisonOperator term)*
- comparisonOperator -> "<" | ">" | "<=" | ">="
- term -> factor (termOperator factor)*
- termOperator -> "-" | "+"
- factor -> unary (factorOperator unary)*
- factorOperator -> "/" | "*"
- unary -> unaryOperator unary | primary
- unaryOperator -> "!" | "-"
- primary -> IDENTIFIER | NUMBER | STRING | "true" | "false" | "null" | "(" expression ")"

## FINISHED IMPLEMENTATION

In this section are the grammar/details of what this project would look like completely finished.

One big change is that "$" will not be used to indicate the start and end of a code block, since it has a purpose in JavaScript for template literals. There may be some other indicator, such as {}, to indicate what is JS and what's not. The final project will parse the CSS blocks within the input file, and will be able to verify if a piece of JavaScript is in an appropriate location or not. As is shown in the grammar below, JS that evaluates to a valid property will be allowed in place of a property, JS that evaluates to a valid style rule will be allowed in place of a style rule, etc.

There are tons of features of JavaScript that I have yet to implement, but the goal for the final project is to allow ALL JavaScript syntax within code blocks (in their appropriate locations within a file). Here I am going to cover some features that I think would be most useful in JSCSS. First off, the ternary operator. It has a very short syntax (expr ? then return x : else return y) for what would otherwise be an if-else statement nested within a function. Short syntax is the name of the game because long blocks of inline code can make the CSS it's wrapped in hard to read. It's for this same reason that arrow functions, template literals, and JS's huge list of string methods would be especially useful tools in JSCSS.

### Grammar

This grammar is not all inclusive of all of CSS and JavaScript's grammar rules. My goal is to use descriptive nonterminal names to make it clear what each rule is changing, since JSCSS will be a superset of CSS and JavaScript. I followed CSS terminology as specified [here](https://www.impressivewebs.com/css-terms-definitions/).

- jscss -> block* | EOF
- block -> css* | js*

***js in this case indicates ANY JavaScript. At the top level, any JS is valid***

- jscssStyleRule -> cssStyleRule | jsObject
- jscssDeclaration -> cssDeclaration | jsKeyValuePair
- jscssProperty -> cssProperty | jsString
- jscssPropertyValue -> cssPropertyValue | jscssLiteral
- jscssSelector -> cssSelector | jscssString

***All of these instances of JSCSS types could be represented as literals or expressions that evaluate to that type***
