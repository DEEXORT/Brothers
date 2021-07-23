// подключаем bcrypt
var bcrypt = require('bcrypt');

function getHash(value) {
  const salt = bcrypt.genSaltSync(10);
  return [bcrypt.hashSync(value, salt), salt]
}





//
//
// //данные для хэширования - пароль пользователя
// var passwordUser = "Deexort7539";
//
// //генерация соли
// var salt = bcrypt.genSaltSync(10);
//
// //хэширование данных - пароля
// var hashPass = bcrypt.hashSync(passwordUser, salt);
//
// console.log(hashPass);
//
// var passwordEntered = "Deexort7539";
// var salt2 = bcrypt.genSaltSync(10);
// var hashPassEntered = bcrypt.hashSync(passwordEntered, salt2);
// if (hashPassEntered === hashPass) {
//   console.log('Yes, its work')
//   console.log(`This is entered - ${hashPassEntered}`)
// }
