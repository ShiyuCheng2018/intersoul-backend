import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface gendersAttributes {
  gender_id: string;
  gender_type: string;
}

export type gendersPk = "gender_id";
export type gendersId = genders[gendersPk];
export type gendersCreationAttributes = gendersAttributes;

export class genders extends Model<gendersAttributes, gendersCreationAttributes> implements gendersAttributes {
  gender_id!: string;
  gender_type!: string;

  // genders hasMany users via gender_id
  users!: users[];
  getUsers!: Sequelize.HasManyGetAssociationsMixin<users>;
  setUsers!: Sequelize.HasManySetAssociationsMixin<users, usersId>;
  addUser!: Sequelize.HasManyAddAssociationMixin<users, usersId>;
  addUsers!: Sequelize.HasManyAddAssociationsMixin<users, usersId>;
  createUser!: Sequelize.HasManyCreateAssociationMixin<users>;
  removeUser!: Sequelize.HasManyRemoveAssociationMixin<users, usersId>;
  removeUsers!: Sequelize.HasManyRemoveAssociationsMixin<users, usersId>;
  hasUser!: Sequelize.HasManyHasAssociationMixin<users, usersId>;
  hasUsers!: Sequelize.HasManyHasAssociationsMixin<users, usersId>;
  countUsers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof genders {
    return genders.init({
    gender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    gender_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'genders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "genders_pkey",
        unique: true,
        fields: [
          { name: "gender_id" },
        ]
      },
    ]
  });
  }
}
