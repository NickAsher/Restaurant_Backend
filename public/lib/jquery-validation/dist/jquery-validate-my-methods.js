$.validator.addMethod("myPasswordCheck", function (value, element) {
  return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these A-Z  a-z 0-9 ! - _ . @
    && /[A-Z]/.test(value) // must have an uppercase letter
    && /[a-z]/.test(value) // must have a lowercase letter
    && /\d/.test(value) ;// must have a digit
}, "Password must have 1 Uppercase letter, 1 Lowercase letter and 1 digit");








