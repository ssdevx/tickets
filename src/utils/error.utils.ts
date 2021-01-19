class ErrorResponse extends Error {

    status: number;
    data: [];

    constructor(status: number, message: string, data: []){

        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
    }

}

module.exports = ErrorResponse;