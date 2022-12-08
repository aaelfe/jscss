import { TokenType } from "./TokenType.js"
import { Token } from "./Token.js"

export class Scanner {
    constructor(source) {
        this.source=source
        this.tokens=[]
        this.start=0
        this.current=0
        this.line=1
        this.keywords={
            'and': TokenType.AND,
            'class': TokenType.CLASS,
            'else': TokenType.ELSE,
            'false': TokenType.FALSE,
            'for': TokenType.FOR,
            'function': TokenType.FUNCTION,
            'if': TokenType.IF,
            'null': TokenType.NULL,
            'or': TokenType.OR,
            'log': TokenType.LOG,
            'return': TokenType.RETURN,
            'this': TokenType.THIS,
            'true': TokenType.TRUE,
            'let': TokenType.LET,
            'while': TokenType.WHILE,
        }
    }
    scanTokens = function() {
        while(!this.isAtEnd()) {
            this.start=this.current
            this.scanCSS()
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
        return this.tokens
    }
    scanCSS = function() {
        this.start=this.current
        // let character=this.advance()
        
        while(this.peek()!="$" && !this.isAtEnd()) {
            this.advance()
        }
    
        let value=this.source.substring(this.start, this.current)
        this.addToken(TokenType.CSS, value)
        this.advance()

        while(!this.isAtEnd()) {
            this.start=this.current
            this.scanToken()
        }
        this.advance()
    }
    scanToken = function() {
        let character=this.advance()
        switch(character) {
            case "$":
                this.scanCSS()
                break
            case "(":
                this.addToken(TokenType.LEFT_PAREN)
                break
            case ")":
                this.addToken(TokenType.RIGHT_PAREN)
                break
            case "{":
                this.addToken(TokenType.LEFT_BRACE)
                break
            case "}":
                this.addToken(TokenType.RIGHT_BRACE)
                break
            case ",":
                this.addToken(TokenType.COMMA)
                break
            case ".":
                this.addToken(TokenType.DOT)
                break
            case "-":
                this.addToken(TokenType.MINUS)
                break
            case "+":
                this.addToken(TokenType.PLUS)
                break
            case ";":
                this.addToken(TokenType.SEMICOLON)
                break
            case "*":
                this.addToken(TokenType.STAR)
                break
            case "/":
                this.addToken(TokenType.SLASH)
                break
            case "!":
                if(this.match("=")) {
                    this.addToken(TokenType.BANG_EQUAL)
                } else {
                    this.addToken(TokenType.BANG)
                }
                break
            case "=":
                if(this.match("=")) {
                    this.addToken(TokenType.EQUAL_EQUAL)
                } else {
                    this.addToken(TokenType.EQUAL)
                }
                break
            case "<":
                if(this.match("=")) {
                    this.addToken(TokenType.LESS_EQUAL)
                } else {
                    this.addToken(TokenType.LESS)
                }
                break
            case ">":
                if(this.match("=")) {
                    this.addToken(TokenType.GREATER_EQUAL)
                } else {
                    this.addToken(TokenType.GREATER)
                }
                break
            case "\n":
                this.line++
                break
            case '"':
                this.scanString()
                break
            default:
                if(character>='0' && character<='9') {
                    this.scanNumber()
                } else if(this.isAlpha(character)) {
                    this.scanIdentifier()
                } else if(!(character==" ")&&!(character=="\r")&&!(character=="\t")) {
                    //INSERT ERROR HERE LATER
                }
                break

        }
    }
    scanNumber = function() {
        while(this.peek()>='0'&&this.peek()<='9') {
            this.advance()
        }
        if(this.peek()=="."&&this.peekNext()>='0'&&this.peekNext()<='9') {
            this.advance()
            while(this.peek()>='0'&&this.peek()<='9') {
                this.advance()
            }
        }
        this.addToken(TokenType.NUMBER, Number(this.source.substring(this.start, this.current)))
    }
    scanIdentifier = function() {
        while(this.isAlpha(this.peek()) || (this.peek()>='0'&&this.peek()<='9')) {
            this.advance()
        }
        let text=this.source.substring(this.start, this.current)
        let tokenType=this.keywords[text]
        if(!tokenType) {
            tokenType=TokenType.IDENTIFIER
        }
        this.addToken(tokenType)
    }
    scanString = function() {
        while(this.peek()!='"' && !this.isAtEnd()) {
            if(this.peek()=="\n") {
                this.line++
            }
            this.advance()
        }
        if(this.isAtEnd()) {
            //INSERT ERROR HERE LATER
            return
        }
        this.advance()
        let value=this.source.substring(this.start+1, this.current-1)
        this.addToken(TokenType.STRING, value)
    }
    match = function(expected) {
        if(this.isAtEnd()) {
            return false
        }
        if(this.source[this.current]!=expected){
            return false
        }
        this.current++
        return true
    }
    peek = function() {
        if(this.isAtEnd()) {
            return "\0"
        }
        return this.source[this.current]
    }
    peekNext = function() {
        if(this.current+1>=this.source.length) {
            return "\0"
        }
        return this.source[this.current+1]
    }
    isAtEnd = function() {
        return this.current>=this.source.length
    }
    advance = function() {
        this.current++
        return this.source[this.current-1]
    }
    addToken = function(tokenType, literal=null) {
        let text=this.source.substring(this.start, this.current)
        this.tokens.push(new Token(tokenType, text, literal, this.line))
    }
    isAlpha (char) {
        return (char >= 'a' && char <= 'z') ||
               (char >= 'A' && char <= 'Z') ||
                char === '_'
    }
}