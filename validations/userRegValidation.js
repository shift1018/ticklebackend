import yup from "yup";


export const userRegSchema = yup.object({
    username: yup.string().min(2).max(20).required(),
    email: yup.string().email().required(),
    password: yup.string().min(5).max(20).required(),
    confirmpassword: yup.string().required().oneOf([yup.ref("password")], "Your passwords do not match."),
    avatarURL: yup.string().nullable()
});

