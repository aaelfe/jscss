import { Scanner } from "./Scanner.js"
import * as fs from "fs/promises"

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
    scanner.scanTokens()
    console.log(scanner.tokens)
}

if(argc!=3) {
    console.log("Usage: node JSCSS.js <filename>")
} else {
    run(args[2])
}