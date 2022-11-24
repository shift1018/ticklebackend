
export const validation = (schema) => async (req, res, next) => {
    const body = req.body;

    try {
        await schema.validate(body);
        next();

        // this line is need to test it in postman
        //return(next);
    } catch (error) {
        return res.status(400).json({error});
    }
}
