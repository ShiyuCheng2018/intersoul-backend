import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface settingsAttributes {
  setting_id: string;
  user_id: string;
  notification_setting: boolean;
  account_visibility: string;
  created_at: Date;
  updated_at: Date;
}

export type settingsPk = "setting_id";
export type settingsId = settings[settingsPk];
export type settingsOptionalAttributes = "notification_setting" | "account_visibility" | "created_at" | "updated_at";
export type settingsCreationAttributes = Optional<settingsAttributes, settingsOptionalAttributes>;

export class settings extends Model<settingsAttributes | settingsCreationAttributes> implements settingsAttributes {
  setting_id!: string;
  user_id!: string;
  notification_setting!: boolean;
  account_visibility!: string;
  created_at!: Date;
  updated_at!: Date;

  // settings belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof settings {
    return settings.init({
    setting_id: {
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
    notification_setting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    account_visibility: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "show"
    }
  }, {
    sequelize,
    tableName: 'settings',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "settings_pkey",
        unique: true,
        fields: [
          { name: "setting_id" },
        ]
      },
    ]
  });
  }
}
