// The ApiError class extends JavaScript's built-in Error class and is used for handling API-related errors in a structured way. It allows for better error management in a backend application


class ApiError extends Error {
    constructor(statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "") {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        // statusCode → Stores the provided HTTP status code.
        // data → Defaults to null (could be used for additional information).
        // message ->  Assigning message
        // success → Always false since it's an error.
        // errors → Stores any additional error details (useful for validation errors).

        if (stack) {
            this.stack = stack
        }
        else {
            // If a stack trace is provided, it assigns it to this.stack.
            // Otherwise, it captures the stack trace automatically using Error.captureStackTrace().
            Error.captureStackTrace(this, this.constructor)
        }
    }

}

export { ApiError }




// Usage Example

// 1. Throwing an API Error

// import { ApiError } from "./ApiError.js";

// throw new ApiError(404, "User not found");


// Output

// {
//     "statusCode": 404,
//     "message": "User not found",
//     "success": false,
//     "errors": []
// }


// Why Use ApiError?
// ✅ Provides structured error handling
// ✅ Makes debugging easier with custom messages & stack traces
// ✅ Supports multiple errors (useful for validation)
// ✅ Works well with Express.js middleware