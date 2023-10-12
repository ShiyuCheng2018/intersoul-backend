import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { messages, messagesId } from './messages';
import type { profileMedias, profileMediasId } from './profile_medias';

export interface mediaTypesAttributes {
  media_type_id: string;
  media_type: string;
}

export type mediaTypesPk = "media_type_id";
export type mediaTypesId = mediaTypes[mediaTypesPk];
export type mediaTypesCreationAttributes = mediaTypesAttributes;

export class mediaTypes extends Model<mediaTypesAttributes, mediaTypesCreationAttributes> implements mediaTypesAttributes {
  media_type_id!: string;
  media_type!: string;

  // mediaTypes hasMany messages via content_type_id
  messages!: messages[];
  getMessages!: Sequelize.HasManyGetAssociationsMixin<messages>;
  setMessages!: Sequelize.HasManySetAssociationsMixin<messages, messagesId>;
  addMessage!: Sequelize.HasManyAddAssociationMixin<messages, messagesId>;
  addMessages!: Sequelize.HasManyAddAssociationsMixin<messages, messagesId>;
  createMessage!: Sequelize.HasManyCreateAssociationMixin<messages>;
  removeMessage!: Sequelize.HasManyRemoveAssociationMixin<messages, messagesId>;
  removeMessages!: Sequelize.HasManyRemoveAssociationsMixin<messages, messagesId>;
  hasMessage!: Sequelize.HasManyHasAssociationMixin<messages, messagesId>;
  hasMessages!: Sequelize.HasManyHasAssociationsMixin<messages, messagesId>;
  countMessages!: Sequelize.HasManyCountAssociationsMixin;
  // mediaTypes hasMany profileMedias via profile_media_type_id
  profile_media!: profileMedias[];
  getProfile_media!: Sequelize.HasManyGetAssociationsMixin<profileMedias>;
  setProfile_media!: Sequelize.HasManySetAssociationsMixin<profileMedias, profileMediasId>;
  addProfile_medium!: Sequelize.HasManyAddAssociationMixin<profileMedias, profileMediasId>;
  addProfile_media!: Sequelize.HasManyAddAssociationsMixin<profileMedias, profileMediasId>;
  createProfile_medium!: Sequelize.HasManyCreateAssociationMixin<profileMedias>;
  removeProfile_medium!: Sequelize.HasManyRemoveAssociationMixin<profileMedias, profileMediasId>;
  removeProfile_media!: Sequelize.HasManyRemoveAssociationsMixin<profileMedias, profileMediasId>;
  hasProfile_medium!: Sequelize.HasManyHasAssociationMixin<profileMedias, profileMediasId>;
  hasProfile_media!: Sequelize.HasManyHasAssociationsMixin<profileMedias, profileMediasId>;
  countProfile_media!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof mediaTypes {
    return mediaTypes.init({
    media_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    media_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'media_types',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "media_types_pkey",
        unique: true,
        fields: [
          { name: "media_type_id" },
        ]
      },
    ]
  });
  }
}
