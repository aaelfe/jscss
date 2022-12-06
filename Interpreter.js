import { TokenType } from "./TokenType.js"
import * as e from "./Expr.js"
import * as s from "./Stmt.js"

export class Interpreter { //I learned today that JS doesn't support multiple inheritance without workarounds
    interpret(statements) {
        let results=""
        try {
            statements.forEach((statement) => {
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
}