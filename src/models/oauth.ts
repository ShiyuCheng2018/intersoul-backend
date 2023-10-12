import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface oauthAttributes {
  token_id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: Date;
  created_at: Date;
}

export type oauthPk = "token_id";
export type oauthId = oauth[oauthPk];
export type oauthOptionalAttributes = "token_id" | "created_at";
export type oauthCreationAttributes = Optional<oauthAttributes, oauthOptionalAttributes>;

export class oauth extends Model<oauthAttributes | oauthCreationAttributes> implements oauthAttributes {
  token_id!: string;
  user_id!: string;
  access_token!: string;
  refresh_token!: string;
  expiry_date!: Date;
  created_at!: Date;

  // oauth belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof oauth {
    return oauth.init({
    token_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    access_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uni_access_token"
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uni_refresh_token"
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'oauth',
    schema: 'public',
    timestamps: true, underscored: true, updatedAt: false,
    indexes: [
      {
        name: "oauth_pkey",
        unique: true,
        fields: [
          { name: "token_id" },
        ]
      },
      {
        name: "uni_access_token",
        unique: true,
        fields: [
          { name: "access_token" },
        ]
      },
      {
        name: "uni_refresh_token",
        unique: true,
        fields: [
          { name: "refresh_token" },
        ]
      },
    ]
  });
  }
}
