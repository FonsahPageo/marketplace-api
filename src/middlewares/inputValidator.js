import Joi from 'joi';

export const userSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().
        pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/\\?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/\\?]{8,30}$"))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 8-30 characters long and include at least one uppercase, lowercase, number and special character'
        }),
    role: Joi.string().min(3),
});

export const productSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3),
    price: Joi.number().integer().min(3).required(),
    image: Joi.string().min(3).required(),
})

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(400).json({ message: error.details.map(d => d.message).join(', ') });
    }
};
