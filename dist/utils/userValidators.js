"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInputs = exports.validateRegisterInput = void 0;
exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username is required';
    }
    if (email.trim() === '') {
        errors.email = 'Email is required';
    }
    else {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.match(regEx)) {
            errors.email = 'Invalid Email Address';
        }
    }
    if (password === '') {
        errors.password = 'Password is required';
    }
    else if (password !== confirmPassword) {
        errors.confirmPassword = 'Password mismatch';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
exports.validateLoginInputs = (username, password) => {
    let errors = {};
    if (username.trim() === '') {
        errors.username = 'Username is required';
    }
    if (password === '') {
        errors.password = 'Password is required';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
//# sourceMappingURL=userValidators.js.map