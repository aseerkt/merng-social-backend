interface LoginInputErrors {
  username?: string;
  password?: string;
}

interface RegisterInputErrors extends LoginInputErrors {
  email?: string;
  confirmPassword?: string;
}

export const validateRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: RegisterInputErrors = {};
  if (username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regEx)) {
      errors.email = 'Invalid Email Address';
    }
  }

  if (password === '') {
    errors.password = 'Password is required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Password mismatch';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInputs = (username: string, password: string) => {
  let errors: LoginInputErrors = {};

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
