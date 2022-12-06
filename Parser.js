import { TokenType } from "./TokenType.js"
import * as e from "./Expr.js"
import * as s from "./Stmt.js"

export class Parser {
    constructor(tokens) {
        this.tokens=tokens
        this.current=0
    }
    expression = function() {
        let eq = this.equality()
        //console.log("expr", eq)
        return eq
    }
    // assignment = function() {
        
    // }
    // logicalOr = function() {
        
    // }
    // logicalAnd = function() {
        
    // }
    equality = function() {
        let expr = this.comparison()
        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            //console.log("equality while loop")
            const operator = this.previous()
            const right = this.comparison()
            expr = new e.Binary(expr, operator, right)
        }
        //console.log("equality", expr)
        return expr
    }
    comparison = function() {
        let expr = this.term()
        while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            //console.log("comparison while loop")
            const operator = this.previous()
            const right = this.term()
            expr = new e.Binary(expr, operator, right)
        }
        //console.log("comparison", expr)
        return expr
    }
    term = function() {
        let expr = this.factor()
        while(this.match(TokenType.MINUS, TokenType.PLUS)) {
            //console.log("term while loop")
            const operator = this.previous()
            const right = this.factor()
            expr = new e.Binary(expr, operator, right)
        }
        //console.log("term", expr)
        return expr
    }
    factor = function() {
        let expr = this.unary()
        while(this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous()
            const right = this.unary()
            expr = new e.Binary(expr, operator, right)
        }
        return expr
    }
    unary = function() {
        if(this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator = this.previous()
            const right = this.unary()
            return new e.Unary(operator, right)
        }
        return this.primary()
    }
    primary = function() {
        // console.log(this.tokens[this.current].tokenType)
        let result
        let yo = this.match(TokenType.PLUS)
        if(this.match(TokenType.FALSE)) {
            result = new e.Literal(false)
        }
        if(this.match(TokenType.TRUE)) {
            result = new e.Literal(true)
        }
        if(this.match(TokenType.NULL)) {
            result = new e.Literal(null)
        }
        if(this.match(TokenType.NUMBER, TokenType.STRING)) {
            result = new e.Literal(this.previous().literal)
        }
        if(this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            result = new e.Grouping(expr)
        }
        //console.log("primary", result)
        //console.log("match w number", yo, this.tokens[this.current].tokenType)
        return result
        //ADD ERROR LATER
    }

    match(...tokenTypes) {
        //console.log(this.current)
        let result=false
        tokenTypes.forEach((tokenType) => {
            // console.log(tokenType)
            if(this.check(tokenType)) {
                // console.log("matched", tokenType)
                this.advance()
                // console.log("true")
                result = true
            }
        })
        // console.log("false")
        return result
    }
    consume(tokenType, message) {
        if(this.check(tokenType)) {
            // console.log("checked in consume", tokenType)
            return this.advance()
        }
        //ADD ERROR LATER
    }
    check(tokenType) {
        // console.log("in check with param", tokenType)
        if(this.isAtEnd()) {
            return false
        }
        //console.log("Check: ",this.tokens[this.current].tokenType==tokenType, this.tokens[this.current].tokenType, tokenType)
        return this.tokens[this.current].tokenType==tokenType
    }
    advance() {
        // console.log("in advance")
        if(!this.isAtEnd()) {
            this.current++
        }
        return this.previous()
    }
    previous() {
        return this.tokens[this.current-1]
    }
    isAtEnd() {
        return this.tokens[this.current].tokenType==TokenType.EOF
    }

    parse() {
        let statements=[]
        while(!this.isAtEnd()) {
            let stmt=this.statement()
            // console.log(stmt)
            statements.push(stmt)
            // console.log(this.tokens[this.current])
        }
        return statements
    }
    statement() {
        // console.log(this.tokens[this.current], this.match(TokenType.CSS))
        if(this.match(TokenType.LOG)) {
            let logStmt=this.printStatement()
            //console.log("log stmt", logStmt)
            return logStmt
        }
        if(this.match(TokenType.CSS)) {
            let cssStmt=this.cssStatement()
            //console.log("css stmt", cssStmt)
            return cssStmt
        }
        let exprStmt=this.expressionStatement()
        //console.log("expr stmt", exprStmt)
        return exprStmt
    }
    cssStatement() {
        return new s.CSS(this.tokens[this.current-1].literal)
    }
    printStatement() {
        const value = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.")
        return new s.Print(value)
    }
    expressionStatement() {
        const expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
        let exprStatement =new s.Expression(expr)
        //console.log("expr statement 2", exprStatement)
        return exprStatement
    }
}