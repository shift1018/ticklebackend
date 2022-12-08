import yup from "yup";


export const userUpdateSchema = yup.object({
    username: yup.string().min(2).max(20).required(),
    city: yup.string().min(2).max(50).required(),
    from: yup.string().min(2).max(50).required(),
    birthday: yup.date().nullable(),
    desc: yup.string().min(2).max(550).nullable()
});
