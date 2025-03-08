// The ApiResponse class is a utility for standardizing API responses in a structured way. It ensures consistency in how success responses are sent from the server.


class ApiResponse {
    constructor(statusCode, data, message = "Success") {

        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400

        // this.statusCode → Stores the HTTP status code.

        // this.data → Stores the response data.

        // this.message → Stores the response message.

        // this.success → A boolean value (true if statusCode is below 400, otherwise false).

        // statusCode < 400 ensures:
        // ✅ true for success responses (200–399)
        // ❌ false for error responses (400+)

    }
}







// Example Usage:
// 1. Sending a Successful API Response

// import { ApiResponse } from "./ApiResponse.js";

// const response = new ApiResponse(200, { id: 1, name: "John Doe" }, "User fetched successfully");
// console.log(response);



// output

// {
//     "statusCode": 200,
//     "data": {
//         "id": 1,
//         "name": "John Doe"
//     },
//     "message": "User fetched successfully",
//     "success": true
// }


// 2. Using ApiResponse in an Express Route
// import express from "express";
// import { ApiResponse } from "./ApiResponse.js";

// const app = express();

// app.get("/user", (req, res) => {
//     const user = { id: 1, name: "John Doe" };
//     res.status(200).json(new ApiResponse(200, user, "User details fetched"));
// });

// app.listen(5000, () => console.log("Server running on port 5000"));




// Why Use ApiResponse?
// ✅ Standardized API responses
// ✅ Consistent success handling
// ✅ Easier debugging & frontend integration
// ✅ Reduces redundant code in controllers

// This makes your API responses cleaner, structured, and easier to maintain! 🚀