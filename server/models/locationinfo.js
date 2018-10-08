import { db } from '../models/';

module.exports = function(sequelize, DataTypes) {
  const LocationInfo = sequelize.define('LocationInfo', {
    parentLocation: DataTypes.INTEGER,
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalFemale: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalMale: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalPopulation: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  LocationInfo.associate = (db) => {
    LocationInfo.belongsTo(db.Location, {
      as: 'locationInfo',
      foreignKey: 'locationId'
    });
    LocationInfo.belongsTo(db.Location, {
      as: 'parent',
      foreignKey: 'parentLocation'
    });
  }

  return LocationInfo;
};
