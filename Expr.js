

export class Expr {
    accept(visitor) {}
}

export class Visitor extends Expr {
    visitBinaryExpr(binary) {}
    visitGroupingExpr(grouping) {}
    visitLiteralExpr(literal) {}
    visitUnaryExpr(unary) {}
    visitVariableExpr(variable) {}
    visitAssignExpr(assign) {}
    visitLogicalExpr(logical) {}
}

export class Binary extends Expr {
    constructor(left, operator, right) {
        super()
        this.left=left
        this.operator=operator
        this.right=right
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this)
    }
}

export class Grouping extends Expr {
    constructor(expression) {
        super()
        this.expression=expression
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this)
    }
}

export class Literal extends Expr {
    constructor(value) {
        super()
        this.value=value
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this)
    }
}

export class Unary extends Expr {
    constructor(operator, right) {
        super()
        this.operator=operator
        this.right=right
    }
    accept(visitor){
        return visitor.visitUnaryExpr(this)
    }
}

export class Variable extends Expr {
    constructor(name) {
        super()
        this.name=name
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this)
    }
}

export class Assign extends Expr {
    constructor(name, value) {
        super()
        this.name=name
        this.value=value
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this)
    }
}

export class Logical extends Expr {
    constructor(left, operator, right) {
        super()
        this.left=left
        this.operator=operator
        this.right=right
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this)
    }
}