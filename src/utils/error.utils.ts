class ErrorResponse extends Error {

    statusCode: number;
    data: [];

    constructor(message: string, statusCode: number, data: any){

        super(message);
        this.statusCode = statusCode
        this.message = message;
        this.data = data
    }

}

module.exports = ErrorResponse;