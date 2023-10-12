import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface verificationsAttributes {
  verification_id: string;
  user_id: string;
  email_verification_status: string;
  phone_verification_status: string;
  profile_medias_verification_status: string;
  verified_date?: string;
  updated_at: Date;
}

export type verificationsPk = "verification_id";
export type verificationsId = verifications[verificationsPk];
export type verificationsOptionalAttributes = "email_verification_status" | "phone_verification_status" | "profile_medias_verification_status" | "verified_date" | "updated_at";
export type verificationsCreationAttributes = Optional<verificationsAttributes, verificationsOptionalAttributes>;

export class verifications extends Model<verificationsAttributes | verificationsCreationAttributes> implements verificationsAttributes {
  verification_id!: string;
  user_id!: string;
  email_verification_status!: string;
  phone_verification_status!: string;
  profile_medias_verification_status!: string;
  verified_date?: string;
  updated_at!: Date;

  // verifications belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof verifications {
    return verifications.init({
    verification_id: {
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
    email_verification_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NOT_VERIFIED"
    },
    phone_verification_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NOT_VERIFIED"
    },
    profile_medias_verification_status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NOT_VERIFIED"
    },
    verified_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'verifications',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "verifications_pkey",
        unique: true,
        fields: [
          { name: "verification_id" },
        ]
      },
    ]
  });
  }
}
