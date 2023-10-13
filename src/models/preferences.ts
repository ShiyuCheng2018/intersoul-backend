import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { body_types, body_typesId } from './body_types';
import type { genders, gendersId } from './genders';
import type { users, usersId } from './users';

export interface preferencesAttributes {
  preference_id: string;
  user_id: string;
  gender_preference_id?: string;
  min_height: number;
  max_height: number;
  body_type_preference_id?: string;
  min_distance: number;
  max_distance: number;
  min_age: number;
  max_age: number;
  created_at: Date;
  updated_at: Date;
}

export type preferencesPk = "preference_id";
export type preferencesId = preferences[preferencesPk];
export type preferencesOptionalAttributes = "preference_id" | "gender_preference_id" | "min_height" | "body_type_preference_id" | "min_distance" | "max_distance" | "min_age" | "max_age" | "created_at" | "updated_at";
export type preferencesCreationAttributes = Optional<preferencesAttributes, preferencesOptionalAttributes>;

export class preferences extends Model<preferencesAttributes| preferencesCreationAttributes> implements preferencesAttributes {
  preference_id!: string;
  user_id!: string;
  gender_preference_id?: string;
  min_height!: number;
  max_height!: number;
  body_type_preference_id?: string;
  min_distance!: number;
  max_distance!: number;
  min_age!: number;
  max_age!: number;
  created_at!: Date;
  updated_at!: Date;

  // preferences belongsTo body_types via body_type_preference_id
  body_type_preference!: body_types;
  getBody_type_preference!: Sequelize.BelongsToGetAssociationMixin<body_types>;
  setBody_type_preference!: Sequelize.BelongsToSetAssociationMixin<body_types, body_typesId>;
  createBody_type_preference!: Sequelize.BelongsToCreateAssociationMixin<body_types>;
  // preferences belongsTo genders via gender_preference_id
  gender_preference!: genders;
  getGender_preference!: Sequelize.BelongsToGetAssociationMixin<genders>;
  setGender_preference!: Sequelize.BelongsToSetAssociationMixin<genders, gendersId>;
  createGender_preference!: Sequelize.BelongsToCreateAssociationMixin<genders>;
  // preferences belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof preferences {
    return preferences.init({
      preference_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
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
      gender_preference_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'genders',
          key: 'gender_id'
        }
      },
      min_height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
      },
      max_height: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      body_type_preference_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'body_types',
          key: 'body_type_id'
        }
      },
      min_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      max_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      min_age: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 18
      },
      max_age: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 100
      }
    }, {
      sequelize,
      tableName: 'preferences',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: "preferences_pkey",
          unique: true,
          fields: [
            { name: "preference_id" },
          ]
        },
      ]
    });
  }
}
