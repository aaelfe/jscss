import { TokenType } from "./TokenType.js"
import * as e from "./Expr.js"
import * as s from "./Stmt.js"
import * as environment from "./Environment.js"

let env = new environment.Environment()

export class Interpreter { //I learned today that JS doesn't support multiple inheritance without workarounds
    interpret(statements) {
        let results=""
        try {
            statements.forEach((statement) => {
                // console.log("statement: ", statement)
                results+=(this.execute(statement))
            })
        } catch(error) {
            console.log(error)
            //BETTER ERROR LATER
        }
        return results
    }
    execute(stmt) {
        return stmt.accept(this)
    }
    executeBlock(statements, environmentParam) {
        let previous=env
        env=environmentParam
        statements.forEach((statement) => {
            this.execute(statement)
        })
        env=previous
    }
    evaluate(expr) {
        return expr.accept(this)
    }
    
    visitLiteralExpr(expr) {
        return expr.value
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression)
    }
    visitBinaryExpr(expr) { //ADD ERROR CHECKS LATER
        let left = this.evaluate(expr.left)
        let right = this.evaluate(expr.right)

        if(expr.operator.tokenType==TokenType.MINUS) {
            return Number(left)-Number(right)
        } else if(expr.operator.tokenType==TokenType.SLASH) {
            return Number(left)/Number(right)
        } else if(expr.operator.tokenType==TokenType.STAR) {
            return Number(left)*Number(right)
        } else if(expr.operator.tokenType==TokenType.PLUS) {
            return left+right //ADD ERROR CHECK FOR STR PLUS NUM LATER
        } else if(expr.operator.tokenType==TokenType.GREATER) {
            return Number(left)>Number(right)
        } else if(expr.operator.tokenType==TokenType.GREATER_EQUAL) {
            return Number(left)>=Number(right)
        } else if(expr.operator.tokenType==TokenType.LESS) {
            return Number(left)<Number(right)
        } else if(expr.operator.tokenType==TokenType.LESS_EQUAL) {
            return Number(left)<=Number(right)
        } else if(expr.operator.tokenType==TokenType.BANG_EQUAL) {
            return left!=right
        } else if(expr.operator.tokenType==TokenType.EQUAL_EQUAL) {
            return left==right
        }
        return null
    }
    visitUnaryExpr(expr) { //ADD ERROR CHECKS
        let right = this.evaluate(expr.right)
        if(expr.operator.tokenType==TokenType.MINUS) {
            return Number(right)*-1.0
        } else if(expr.operator.tokenType==TokenType.BANG) {
            return !right
        }
        return null
    }
    visitVariableExpr(expr) {
        return env.get(expr.name)
    }
    visitAssignExpr(expr) {
        let value=this.evaluate(expr.value)
        env.assign(expr.name, value)
        return value
    }
    visitLogicalExpr(expr) {
        let left=this.evaluate(expr.left)
        if(expr.operator.tokenType==TokenType.OR) {
            if(left) return left
        } else {
            if(!left) return left
        }
        return this.evaluate(expr.right)
    }

    visitCSSStmt(stmt) {
        // console.log(stmt.css)
        return stmt.css
    }
    visitExpressionStmt(stmt) {
        return this.evaluate(stmt.expression)
    }
    visitPrintStmt(stmt) {
        let value = this.evaluate(stmt.expression)
        console.log(value.toString())
        return ""
    }
    visitIfStmt(stmt) {
        if(this.evaluate(stmt.condition)) {
            this.execute(stmt.thenBranch)
        } else if(stmt.elseBranch) {
            this.execute(stmt.elseBranch)
        }
        return ""
    }
    visitLetStmt(stmt) {
        let value=null
        if(stmt.initializer) {
            value=this.evaluate(stmt.initializer)
        }
        env.define(stmt.name.lexeme, value)
        return ""
    }
    visitWhileStmt(stmt) {
        // console.log('in while')
        while(this.evaluate(stmt.condition)) {
            this.execute(stmt.body)
        }
        return ""
    }
    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new environment.Environment(env))
        return ""
    }
}