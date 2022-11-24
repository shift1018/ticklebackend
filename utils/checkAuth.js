// this file is a middleware needed to verify accessToken of the user and then is used in the routes as function checkAuth
import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    // Here we get the token from header in the line "authorization". Originally it looks like this string "Bearer, kjg4kjh45643kjghkg2546k"
    // to get only token from the string we use .replace (or split function can be used)
    const accessToken = (req.headers.authorization || "").replace(/Bearer\s?/, "")

    if(accessToken) {
        try {
            // decode the token which we get from header above
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

            // adding additional fields into request to further manipulate them
            req.userId = decoded.id;
            req.userRole = decoded.role;
            req.userEmail = decoded.email;
            req.userName = decoded.username;

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

