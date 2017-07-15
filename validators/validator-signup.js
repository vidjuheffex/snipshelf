module.exports = function(passwordConfirm){
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
      }
    };
};
