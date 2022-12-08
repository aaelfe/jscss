export class Environment {
    constructor(enclosing=null) {
        this.values={}
        this.enclosing=enclosing
    }
    define(name, value) {
        this.values[name]=value
    }
    get(name) {
        if(name.lexeme in this.values) {
            return this.values[name.lexeme]
        }
        if(this.enclosing) {
            return this.enclosing.get(name)
        }
    }
    assign(name, value) {
        if(name.lexeme in this.values) {
            this.values[name.lexeme]=value
            return
        }
        if(this.enclosing) {
            this.enclosing.assign(name, value)
            return
        }
    }
}