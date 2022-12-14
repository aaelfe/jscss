

export class Stmt {
    accept(visitor) {}
}

export class Visitor extends Stmt {
    visitExpressionStmt(stmt) {}
    visitPrintStmt(stmt) {}
    visitCSSStmt(stmt) {}
    visitIfStmt(stmt) {}
    visitLetStmt(stmt) {}
    visitBlockStmt(stmt) {}
    visitWhileStmt(stmt) {}
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

export class If extends Stmt {
    constructor(condition, thenBranch, elseBranch) {
        super()
        this.condition=condition
        this.thenBranch=thenBranch
        this.elseBranch=elseBranch
    }
    accept(visitor) {
        return visitor.visitIfStmt(this)
    }
}

export class Let extends Stmt {
    constructor(name, initializer) {
        super()
        this.name=name
        this.initializer=initializer
    }
    accept(visitor) {
        return visitor.visitLetStmt(this)
    }
}

export class Block extends Stmt {
    constructor(statements) {
        super()
        this.statements=statements
    }
    accept(visitor) {
        return visitor.visitBlockStmt(this)
    }
}

export class While extends Stmt {
    constructor(condition, body) {
        super()
        this.condition=condition
        this.body=body
    }
    accept(visitor) {
        return visitor.visitWhileStmt(this)
    }
}