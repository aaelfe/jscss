import * as e from "./Expr.js"
import { Token } from "./Token.js"
import { TokenType } from "./TokenType.js"

export class AstPrinter {
    print(statements) {
        // console.log(expr)
        let result=[]
        statements.forEach((statement, i) => {
            result.push(statements[i].accept(this))
        })
        // return expr[1].accept(this)
        return result
    }
    
    visitBinaryExpr(expr) {
        return "("+expr.operator.lexeme+" "+expr.left.accept(this)+" "+expr.right.accept(this)+")"
    }
    visitGroupingExpr(expr) {
        return "(group "+expr.expression.accept(this)+")"
    }
    visitLiteralExpr(expr) {
        if(!expr.value) {
            return "null"
        }
        return expr.value.toString()
    }
    visitUnaryExpr(expr) {
        return "("+expr.operator.lexeme+" "+expr.right.accept(this)+")"
    }

    visitExpressionStmt(stmt) {
        return stmt.expression.accept(this)
    }
    visitPrintStmt(stmt) {
        return "(log "+stmt.expression.value+")"
    }
    visitCSSStmt(stmt) {
        return "css"
    }
}

let expression=new e.Binary(
    new e.Unary(
        new Token(TokenType.MINUS, "-", null, 1),
        new e.Literal(123)
    ),
    new Token(TokenType.STAR, "*", null, 1),
    new e.Grouping(
        new e.Literal(45.67)
    )
)

// let ast = new AstPrinter()
// console.log(ast.print(expression))