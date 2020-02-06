$.validator.addMethod('isSecure_ValidYesNo', function (value, element) {
    return (value === "yes" || value === "no") ;
}, 'This value must be yes or no');






$.validator.addMethod('isSecure_IsValidPositiveDecimal', function (value, element) {
    return /^\d+\.?\d+$/.test(value) ;
}, 'Must be a valid postive number or decimal');



$.validator.addMethod('isSecure_isValidPositiveInteger', function (value, element) {
    return /^\d+$/.test(value) ;
}, 'Must be a valid postive number ');


$.validator.addMethod('isSecure_IsValidText', function (value, element) {
    return /^\d+\.?\d+$/.test(value) ;
}, 'Must be a valid postive number or decimal');



$.validator.addMethod('isSecure_isValidPositiveInteger', function (value, element) {
    return /^\d+\.?\d+$/.test(value) ;
}, 'Must be a valid postive number or decimal');



