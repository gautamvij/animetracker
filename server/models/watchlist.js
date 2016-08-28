module.exports = function(sequelize, DataTypes) {

  var Watchlist = sequelize.define('Watchlist', {
    storeType: DataTypes.INTEGER,
    animeId : DataTypes.INTEGER,
    userId : DataTypes.INTEGER
  });

  return Watchlist;
};
