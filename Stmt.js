

export class Stmt {
    accept(visitor) {}
}

export class Visitor extends Stmt {
    visitExpressionStmt(stmt) {}
    visitPrintStmt(stmt) {}
    visitCSSStmt(stmt) {}
}

export class CSS extends Stmt {
    constructor(css) {
        super()
        this.css=css
    }
    accept(visitor) {
        return visitor.visitCSSStmt(this)
    }
}

export class Expression extends Stmt {
    constructor(expression) {
        super()
        this.expression=expression
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this)
    }
}

export class Print extends Stmt {
    constructor(expression) {
        super()
        this.expression=expression
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this)
    }
}