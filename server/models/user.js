module.exports = function(sequelize, DataTypes) {
  "use strict";

  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {
  getterMethods   : {
    fullName      : function()  { return this.username + "cssdcsdcsd"; }
  }
}
  );

  return User;
};