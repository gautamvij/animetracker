module.exports = function(sequelize, DataTypes) {
  "use strict";

  var UserWatchList = sequelize.define("UserWatchList", {
  	status: DataTypes.STRING
  });

  return UserWatchList;
};
