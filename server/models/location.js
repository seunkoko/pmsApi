import { db } from '../models/';

module.exports = function(sequelize, DataTypes) {
  const Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
  }});

  Location.associate = (db) => {
    Location.hasMany(db.LocationInfo, {
      as: 'locationInfo',
      foreignKey: 'locationId'
    });
    Location.hasMany(db.LocationInfo, {
      as: 'parent',
      foreignKey: 'parentLocation'
    });
  } 
  
  return Location;
};
