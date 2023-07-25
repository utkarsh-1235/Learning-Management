class AppError extends Error {
    constructor(messge, statusCode){
        super(message)

        this .statusCode = statusCode

        Error.capturesStacktrace(this, this.constructor)
    }
}