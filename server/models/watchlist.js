module.exports = function(sequelize, DataTypes) {
  "use strict";

  var Watchlist = sequelize.define("Watchlist", {
  	watchlistId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  	},
  	image_url_lge: DataTypes.STRING,
  	title_english: DataTypes.STRING,
  	description : DataTypes.STRING
  });

  return Watchlist;
};