import { TokenType } from "./TokenType.js"
import * as e from "./Expr.js"
import * as s from "./Stmt.js"

export class Parser {
    constructor(tokens) {
        this.tokens=tokens
        this.current=0
    }
    expression = function() {
        let eq = this.assignment()
        //console.log("expr", eq)
        return eq
    }
    assignment = function() {
        let expr=this.logicalOr()
        if(this.match(TokenType.EQUAL)) {
            let equals=this.previous()
            let value=this.assignment()
            if(expr instanceof e.Variable) {
                // console.log("return assign")
                return new e.Assign(expr.name, value)
            }
            //ERROR HERE CALL HERE
        }
        return expr
    }
    logicalOr = function() {
        let expr=this.logicalAnd()
        while(this.match(TokenType.OR)) {
            let operator=this.previous()
            let right=this.logicalAnd()
            expr= new e.Logical(expr, operator, right)
        }
        return expr
    }
    logicalAnd = function() {
        let expr=this.equality()
        while(this.match(TokenType.AND)) {
            let operator=this.previous()
            let right=this.equality()
            expr= new e.Logical(expr, operator, right)
        }
        return expr
    }
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
        // let yo = this.match(TokenType.PLUS)
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
        if(this.match(TokenType.IDENTIFIER)) {
            result = new e.Variable(this.previous())
        }
        if(this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            result = new e.Grouping(expr)
        }
        // if(this.match(TokenType.LEFT_BRACE)) {
        //     result = new s.Block(this.block())
        // }
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
            let stmt=this.declaration()
            // console.log(stmt)
            statements.push(stmt)
            // console.log(this.tokens[this.current])
        }
        return statements
    }
    declaration() { //ADD ERROR IMPLEMENTATION LATER
        if(this.match(TokenType.LET)) {
            // console.log("hey")
            return this.letDeclaration()
        }
        return this.statement()
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
        if(this.match(TokenType.FOR)) {
            return this.forStatement()
        }
        if(this.match(TokenType.IF)) {
            return this.ifStatement()
        }
        if(this.match(TokenType.WHILE)) {
            // console.log("parser matched while token")
            return this.whileStatement()
        }
        if(this.match(TokenType.LEFT_BRACE)) {
            return new s.Block(this.block())
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
    forStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.")
        let initializer
        if(this.match(TokenType.SEMICOLON)) {
            initializer=null
        } else if(this.match(TokenType.VAR)) {
            initializer=this.letDeclaration()
        } else {
            initializer=this.expressionStatement()
        }
        let condition=null
        if(!this.check(TokenType.SEMICOLON)) {
            condition=this.expression()
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after condition.")
        let increment=null
        if(!this.check(TokenType.RIGHT_PAREN)) {
            increment=this.expression()
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clause.")
        let body=this.statement()
        if(increment) {
            body=new s.Block([body, increment])
        }
        if(!condition) {
            condition=new e.Literal(true)
        }
        body=new s.While(condition, body)
        if(initializer) {
            body=new s.Block([initializer, body])
        }
        return body
    }
    whileStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.")
        let condition=this.expression()
        this.consume(TokenType.RIGHT_PAREN, "")
        let body=this.statement()
        return new s.While(condition, body)
    }
    ifStatement() {
        this.consume(TokenType.LEFT_PAREN, "")
        let condition=this.expression()
        this.consume(TokenType.RIGHT_PAREN, "")
        let thenBranch=this.statement()
        let elseBranch=null
        if(this.match(TokenType.ELSE)) {
            elseBranch=this.statement()
        }
        return new s.If(condition, thenBranch, elseBranch)
    }
    letDeclaration() {
        let name=this.consume(TokenType.IDENTIFIER, "Expect variable name.")
        let initializer=null
        if(this.match(TokenType.EQUAL)) {
            initializer=this.expression()
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.")
        return new s.Let(name, initializer)
    }
    block() {
        // console.log("block")
        let statements=[]
        // console.log(!this.check(TokenType.RIGHT_BRACE) && this.tokens[this.current].tokenType!=TokenType.EOF)
        while(!this.check(TokenType.RIGHT_BRACE) && this.tokens[this.current].tokenType!=TokenType.EOF) {
            // console.log("inwhile")
            statements.push(this.declaration())
        }
        this.consume(TokenType.RIGHT_BRACE, "")
        return statements
    }
}