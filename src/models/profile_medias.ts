import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { mediaTypes, mediaTypesId } from './media_types';
import type { users, usersId } from './users';

export interface profileMediasAttributes {
  profile_media_id: string;
  user_id: string;
  profile_media_type_id: string;
  media_path: string;
  order: number;
  upload_date: Date;
}

export type profileMediasPk = "profile_media_id";
export type profileMediasId = profileMedias[profileMediasPk];
export type profileMediasCreationAttributes = profileMediasAttributes;

export class profileMedias extends Model<profileMediasAttributes, profileMediasCreationAttributes> implements profileMediasAttributes {
  profile_media_id!: string;
  user_id!: string;
  profile_media_type_id!: string;
  media_path!: string;
  order!: number;
  upload_date!: Date;

  // profileMedias belongsTo mediaTypes via profile_media_type_id
  profile_media_type!: mediaTypes;
  getProfile_media_type!: Sequelize.BelongsToGetAssociationMixin<mediaTypes>;
  setProfile_media_type!: Sequelize.BelongsToSetAssociationMixin<mediaTypes, mediaTypesId>;
  createProfile_media_type!: Sequelize.BelongsToCreateAssociationMixin<mediaTypes>;
  // profileMedias belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof profileMedias {
    return profileMedias.init({
    profile_media_id: {
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
    profile_media_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media_types',
        key: 'media_type_id'
      }
    },
    media_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    order: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'profile_medias',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "profile_medias_pkey",
        unique: true,
        fields: [
          { name: "profile_media_id" },
        ]
      },
    ]
  });
  }
}
