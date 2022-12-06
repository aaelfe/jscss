# jscss

Compiler tool for creating CSS files by incorporating inline Javascript.

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
