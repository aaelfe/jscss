import { Scanner } from "./Scanner.js"
import * as fs from "fs/promises"
import { Parser } from "./Parser.js"
import { AstPrinter } from "./AstPrinter.js"
import { Interpreter } from "./Interpreter.js"

let args=process.argv
let argc=args.length

let hadError=false
let hadRuntimeError=false

let run = async function(inputFile) {
    let input = await fs.readFile(inputFile, "ascii", function(err, data) {
        if(err) {
            console.log("readFile error")
            //ADD ERROR
            return
        }
        return data
    })

    let scanner = new Scanner(input)
    let tokens=scanner.scanTokens()
    // console.log(tokens)

    let parser = new Parser(tokens)
    let statements=parser.parse()
    // let ast = new AstPrinter()

    // console.log(ast.print(statements))
    let interpreter = new Interpreter()
    interpreter.interpret(statements)

    fs.writeFile('test.css', 'hey there', "ascii", (err) => {
        if (err) return console.log(err)
    })
}

if(argc!=3) {
    console.log("Usage: node JSCSS.js <filename>")
} else {
    run(args[2])
}