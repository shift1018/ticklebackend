import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    // Here we get the token from header. Originally it looks like "Bearer, kjg4kjh45643kjghkg2546k"
    // to get only token from the string we use .replace (or split function can be used)
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "")

    if(token) {
        try {
            // decode the token which we get from header above
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // adding additional field into request
            req.userId = decoded.id;

            // we use next to proceed in the routes.auth.js in request /user to the next function getUser
            next();

        }catch (error){
            return res.json({
                message: "Access denied",
            })
        }
    } else {
        return res.json({
            message: "Access denied",
        })
    }

}

