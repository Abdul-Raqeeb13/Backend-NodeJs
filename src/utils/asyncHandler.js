// The asyncHandler function is a higher-order function (a function that takes another function as an argument). It is used in Express.js to handle asynchronous errors in route handlers without using try...catch in every route.

// 📌 How It Works?
// It takes an async request handler (requestHandler) as an argument.
// It returns a new function that executes the handler inside Promise.resolve().
// If the handler throws an error, .catch((err) => next(err)) ensures the error is passed to Express’s error-handling middleware.


// 🔹 Why Use asyncHandler?
// Normally, when using async/await, you have to wrap every route in a try...catch block to handle errors properly. Instead of repeating try-catch in every route, asyncHandler does it automatically.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };





// 🔹  Example Code how to call asynchandle function in other file


// Client requests GET /users
// router.get(
//     "/users",
//     asyncHandler(async (req, res) => {
//         const users = await User.find();  // 🟢 Successful: Sends response
//         res.json(users);
//     })
// );

// // If an error occurs inside asyncHandler:
// asyncHandler(async (req, res) => {
//     throw new Error("Database error!");  // 🔴 Error: asyncHandler catches and passes it to next(err)
// });

// 📌 Example Error-Handling Middleware (Handles Errors from asyncHandler)

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: err.message || "Something went wrong!" });
// });

// If an error occurs in asyncHandler, it is passed to this middleware using next(err).
// The middleware logs the error and sends a JSON response.


// 🚀 Summary
// ✅ asyncHandler ensures errors are caught and passed to next(err).
// ✅ Removes the need for try...catch in every route.
// ✅ Keeps route handlers clean and readable.
// ✅ Works seamlessly with Express error-handling middleware

