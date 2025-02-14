import { RuleObject } from "antd/es/form";

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
const validatePassword = (_rule: RuleObject, value: string): Promise<void> => {
    if (!value) {
        return Promise.resolve();
    }

    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>[\]\\/`~_\-=+;']/.test(value);
    const hasWhiteSpace = /\s/.test(value);

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

export default validatePassword;
