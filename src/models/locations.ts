import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface locationsAttributes {
  location_id: string;
  user_id: string;
  longitude: number;
  latitude: number;
  country: string;
  state?: string;
  city: string;
  created_at: Date;
  updated_at: Date;
}

export type locationsPk = "location_id";
export type locationsId = locations[locationsPk];
export type locationsOptionalAttributes = "state" | "created_at" | "updated_at";
export type locationsCreationAttributes = Optional<locationsAttributes, locationsOptionalAttributes>;

export class locations extends Model<locationsAttributes | locationsCreationAttributes> implements locationsAttributes {
  location_id!: string;
  user_id!: string;
  longitude!: number;
  latitude!: number;
  country!: string;
  state?: string;
  city!: string;
  created_at!: Date;
  updated_at!: Date;

  // locations belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof locations {
    return locations.init({
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'locations',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "locations_pkey",
        unique: true,
        fields: [
          { name: "location_id" },
        ]
      },
    ]
  });
  }
}
