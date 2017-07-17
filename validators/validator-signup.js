module.exports = function(passwordConfirm, secret){
    return {
      'password':
      {
        notEmpty: {
          options: true,
          errorMessage: "Password can't be empty."
        },
        matches: {
          options: [ passwordConfirm ],
          errorMessage: "Passwords don't match"
        }
      },
      'secret': {
        notEmpty: {
          options: true,
          errorMessage: 'API Secret Incorrect'
        },
        matches: {
          options: [ secret],
          errorMessage: "Secret Key Incorrect"
        }
      }
    };
};
