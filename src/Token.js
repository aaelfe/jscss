export class Token {
    constructor(tokenType, lexeme, literal, line) {
        this.tokenType=tokenType
        this.lexeme=lexeme
        this.literal=literal
        this.line=line
    }
}