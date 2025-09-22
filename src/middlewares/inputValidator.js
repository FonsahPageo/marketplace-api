import Joi from 'joi';

export const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email of format username@domain.com',
        'string.empty': 'Email cannot be empty',
    }),
    password: Joi.string().
        pattern(
            new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/\\?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/\\?]{8,30}$"))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 8-30 characters long and include at least one uppercase, lowercase, number and special character',
            'string.empty': 'Password cannot be empty',
        }),
    role: Joi.string().min(3),
}).required();

export const loginSchema = Joi.object({
    username: Joi.string().min(3).messages({
        'string.empty': 'Username cannot be empty'
    }),
    email: Joi.string().email().messages({
        'string.empty': 'Email cannot be empty'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Please provide the password',
        'string.empty': 'Password cannot be empty',
    })
})
    .or('username', 'email')
    .messages({
        'object.missing': 'Please provide either a username or email',
    });

export const productSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        'any.required': 'Product title is required',
        'string.empty': 'Product title cannot be empty'
    }),
    description: Joi.string().min(3).messages({
    }),
    category: Joi.string().min(3).required().messages({
    }),
    price: Joi.number().integer().min(3).required().messages({
        'any.required': 'Product price is required',
        'string.empty': 'Product price cannot be empty'
    }),
    image: Joi.string().min(3).required().messages({
        'any.required': 'Product image is required',
        'string.empty': 'Product image cannot be empty'
    }),
}).required();

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(400).json({ message: error.details.map(d => d.message).join(', ') });
    }
};
