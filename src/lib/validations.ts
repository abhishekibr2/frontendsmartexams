import { RuleObject } from "antd/lib/form";

export const validationRules = {
    email: {
        maxLength: 100,
        minLength: 3,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
        maxLength: 10,
        minLength: 8,
        strongRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@!*#%&()^~{}])[A-Za-z\d@!*#%&()^~{}]{8,10}$/
    },
    textLength: {
        maxLength: 70,
        minLength: 10,
        pattern: /^[a-zA-Z0-9 ]*$/,
    },
    textLongLength: {
        maxLength: 150,
        minLength: 10,
    },
    textEditor: {
        maxLength: 1500,
        minLength: 10,
    },
    phoneNumber: {
        maxLength: 15,
        pattern: /^\+?[0-9]{1,4}?[-. ]?\(?(?:[0-9]{1,3})\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4}$/
    },
    websiteURL: {
        pattern: /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?$|^(https?:\/\/)?localhost(:\d+)?(\/[^\s]*)?$/i,
        message: 'Please enter a valid link',
    },
    facebookURL: {
        pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/([a-zA-Z0-9._]{1,30})\/?$/i
    },
    twitterURL: {
        pattern: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/?$/i
    },
    linkedinURL: {
        pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]{5,30})\/?$/i
    },
    instagramURL: {
        pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?(\?[a-zA-Z0-9=&]*)?$/i
    },
    youtubeURL: {
        pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/).+$/,
        message: 'Please enter a valid YouTube URL'
    },
    stripeKeys: {
        maxLength: 50,
        pattern: /^(sk_test|pk_test|sk_live|pk_live)_[a-zA-Z0-9]{24}$/ // Adjust the pattern as needed
    },
    paypalKeys: {
        maxLength: 50,
        pattern: /^[A-Z0-9]{16}$/ // Adjust the pattern as needed
    },


    // Add more validation rules as needed
};

/**
 * Custom validator function for validating passwords.
 *
 * @param {RuleObject} rule - The validation rule object provided by Ant Design.
 * @param {string} value - The value of the password field to validate.
 *
 * @returns {Promise<void>} A promise that resolves if the validation is successful,
 * or rejects with an error message if validation fails.
 *
 * The function performs the following checks:
 * - Password must not contain white spaces.
 * - Password must be at least 6 characters long.
 * - Password must include at least one uppercase letter.
 * - Password must include at least one lowercase letter.
 * - Password must include at least one number.
 * - Password must include at least one special character (@$!%*?&).
 */
export const validatePassword = (_rule: RuleObject, value: string): Promise<void> => {
    if (!value) {
        return Promise.resolve();
    }

    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>[\]\\/`~_\-=+;']/.test(value);
    const hasWhiteSpace = /\s/.test(value); // Check for white space

    if (hasWhiteSpace) {
        return Promise.reject('Password should not contain white spaces.');
    }
    if (value.length < minLength) {
        return Promise.reject('Password must be at least 6 characters long.');
    }
    if (!hasUpperCase) {
        return Promise.reject('Password must include at least one uppercase letter.');
    }
    if (!hasLowerCase) {
        return Promise.reject('Password must include at least one lowercase letter.');
    }
    if (!hasNumber) {
        return Promise.reject('Password must include at least one number.');
    }
    if (!hasSpecialChar) {
        return Promise.reject('Password must include at least one special character.');
    }

    return Promise.resolve();
};
