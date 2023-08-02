class AppError extends Error {
    constructor(message, statusCode){
        super(message)

        this .statusCode = statusCode

        Error.capturesStacktrace(this, this.constructor)
    }
}
export default AppError