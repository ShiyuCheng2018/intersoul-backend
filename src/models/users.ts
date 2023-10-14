import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { chats, chatsId } from './chats';
import type { genders, gendersId } from './genders';
import type { interactions, interactionsId } from './interactions';
import type { locations, locationsId } from './locations';
import type { messages, messagesId } from './messages';
import type { oauth, oauthId } from './oauth';
import type { profileMedias, profileMediasId } from './profile_medias';
import type { reports, reportsId } from './reports';
import type { settings, settingsId } from './settings';
import type { verifications, verificationsId } from './verifications';
import {body_types, body_typesId} from "./body_types";

export interface usersAttributes {
  user_id: string;
  email: string;
  hashed_password?: string;
  user_name?: string;
  date_of_birth?: string;
  created_at: Date;
  updated_at: Date;
  provider?: string;
  provider_id?: string;
  gender_id?: string;
  profile_description?: string;
  is_profile_complete: boolean;
  height?: number;
  body_type_id?: string;
}

export type usersPk = "user_id";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "user_id" | "hashed_password" | "user_name" | "date_of_birth" | "created_at" | "updated_at" | "provider" | "provider_id" | "gender_id" | "profile_description" | "height" | "body_type_id";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes | usersCreationAttributes> implements usersAttributes {
  user_id!: string;
  email!: string;
  hashed_password?: string;
  user_name?: string;
  date_of_birth?: string;
  created_at!: Date;
  updated_at!: Date;
  provider?: string;
  provider_id?: string;
  gender_id?: string;
  profile_description?: string;
  is_profile_complete!: boolean;
  height?: number;
  body_type_id?: string;

  // users belongsTo body_types via body_type_id
  body_type!: body_types;
  getBody_type!: Sequelize.BelongsToGetAssociationMixin<body_types>;
  setBody_type!: Sequelize.BelongsToSetAssociationMixin<body_types, body_typesId>;
  createBody_type!: Sequelize.BelongsToCreateAssociationMixin<body_types>;
  // users belongsTo genders via gender_id
  gender!: genders;
  getGender!: Sequelize.BelongsToGetAssociationMixin<genders>;
  setGender!: Sequelize.BelongsToSetAssociationMixin<genders, gendersId>;
  createGender!: Sequelize.BelongsToCreateAssociationMixin<genders>;
  // users hasMany chats via user1_id
  chats!: chats[];
  getChats!: Sequelize.HasManyGetAssociationsMixin<chats>;
  setChats!: Sequelize.HasManySetAssociationsMixin<chats, chatsId>;
  addChat!: Sequelize.HasManyAddAssociationMixin<chats, chatsId>;
  addChats!: Sequelize.HasManyAddAssociationsMixin<chats, chatsId>;
  createChat!: Sequelize.HasManyCreateAssociationMixin<chats>;
  removeChat!: Sequelize.HasManyRemoveAssociationMixin<chats, chatsId>;
  removeChats!: Sequelize.HasManyRemoveAssociationsMixin<chats, chatsId>;
  hasChat!: Sequelize.HasManyHasAssociationMixin<chats, chatsId>;
  hasChats!: Sequelize.HasManyHasAssociationsMixin<chats, chatsId>;
  countChats!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany chats via user2_id
  user2_chats!: chats[];
  getUser2_chats!: Sequelize.HasManyGetAssociationsMixin<chats>;
  setUser2_chats!: Sequelize.HasManySetAssociationsMixin<chats, chatsId>;
  addUser2_chat!: Sequelize.HasManyAddAssociationMixin<chats, chatsId>;
  addUser2_chats!: Sequelize.HasManyAddAssociationsMixin<chats, chatsId>;
  createUser2_chat!: Sequelize.HasManyCreateAssociationMixin<chats>;
  removeUser2_chat!: Sequelize.HasManyRemoveAssociationMixin<chats, chatsId>;
  removeUser2_chats!: Sequelize.HasManyRemoveAssociationsMixin<chats, chatsId>;
  hasUser2_chat!: Sequelize.HasManyHasAssociationMixin<chats, chatsId>;
  hasUser2_chats!: Sequelize.HasManyHasAssociationsMixin<chats, chatsId>;
  countUser2_chats!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany interactions via user1_id
  interactions!: interactions[];
  getInteractions!: Sequelize.HasManyGetAssociationsMixin<interactions>;
  setInteractions!: Sequelize.HasManySetAssociationsMixin<interactions, interactionsId>;
  addInteraction!: Sequelize.HasManyAddAssociationMixin<interactions, interactionsId>;
  addInteractions!: Sequelize.HasManyAddAssociationsMixin<interactions, interactionsId>;
  createInteraction!: Sequelize.HasManyCreateAssociationMixin<interactions>;
  removeInteraction!: Sequelize.HasManyRemoveAssociationMixin<interactions, interactionsId>;
  removeInteractions!: Sequelize.HasManyRemoveAssociationsMixin<interactions, interactionsId>;
  hasInteraction!: Sequelize.HasManyHasAssociationMixin<interactions, interactionsId>;
  hasInteractions!: Sequelize.HasManyHasAssociationsMixin<interactions, interactionsId>;
  countInteractions!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany interactions via user2_id
  user2_interactions!: interactions[];
  getUser2_interactions!: Sequelize.HasManyGetAssociationsMixin<interactions>;
  setUser2_interactions!: Sequelize.HasManySetAssociationsMixin<interactions, interactionsId>;
  addUser2_interaction!: Sequelize.HasManyAddAssociationMixin<interactions, interactionsId>;
  addUser2_interactions!: Sequelize.HasManyAddAssociationsMixin<interactions, interactionsId>;
  createUser2_interaction!: Sequelize.HasManyCreateAssociationMixin<interactions>;
  removeUser2_interaction!: Sequelize.HasManyRemoveAssociationMixin<interactions, interactionsId>;
  removeUser2_interactions!: Sequelize.HasManyRemoveAssociationsMixin<interactions, interactionsId>;
  hasUser2_interaction!: Sequelize.HasManyHasAssociationMixin<interactions, interactionsId>;
  hasUser2_interactions!: Sequelize.HasManyHasAssociationsMixin<interactions, interactionsId>;
  countUser2_interactions!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany locations via user_id
  locations!: locations[];
  getLocations!: Sequelize.HasManyGetAssociationsMixin<locations>;
  setLocations!: Sequelize.HasManySetAssociationsMixin<locations, locationsId>;
  addLocation!: Sequelize.HasManyAddAssociationMixin<locations, locationsId>;
  addLocations!: Sequelize.HasManyAddAssociationsMixin<locations, locationsId>;
  createLocation!: Sequelize.HasManyCreateAssociationMixin<locations>;
  removeLocation!: Sequelize.HasManyRemoveAssociationMixin<locations, locationsId>;
  removeLocations!: Sequelize.HasManyRemoveAssociationsMixin<locations, locationsId>;
  hasLocation!: Sequelize.HasManyHasAssociationMixin<locations, locationsId>;
  hasLocations!: Sequelize.HasManyHasAssociationsMixin<locations, locationsId>;
  countLocations!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany messages via recipient_id
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
  // users hasMany messages via sender_id
  sender_messages!: messages[];
  getSender_messages!: Sequelize.HasManyGetAssociationsMixin<messages>;
  setSender_messages!: Sequelize.HasManySetAssociationsMixin<messages, messagesId>;
  addSender_message!: Sequelize.HasManyAddAssociationMixin<messages, messagesId>;
  addSender_messages!: Sequelize.HasManyAddAssociationsMixin<messages, messagesId>;
  createSender_message!: Sequelize.HasManyCreateAssociationMixin<messages>;
  removeSender_message!: Sequelize.HasManyRemoveAssociationMixin<messages, messagesId>;
  removeSender_messages!: Sequelize.HasManyRemoveAssociationsMixin<messages, messagesId>;
  hasSender_message!: Sequelize.HasManyHasAssociationMixin<messages, messagesId>;
  hasSender_messages!: Sequelize.HasManyHasAssociationsMixin<messages, messagesId>;
  countSender_messages!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany oauth via user_id
  oauths!: oauth[];
  getOauths!: Sequelize.HasManyGetAssociationsMixin<oauth>;
  setOauths!: Sequelize.HasManySetAssociationsMixin<oauth, oauthId>;
  addOauth!: Sequelize.HasManyAddAssociationMixin<oauth, oauthId>;
  addOauths!: Sequelize.HasManyAddAssociationsMixin<oauth, oauthId>;
  createOauth!: Sequelize.HasManyCreateAssociationMixin<oauth>;
  removeOauth!: Sequelize.HasManyRemoveAssociationMixin<oauth, oauthId>;
  removeOauths!: Sequelize.HasManyRemoveAssociationsMixin<oauth, oauthId>;
  hasOauth!: Sequelize.HasManyHasAssociationMixin<oauth, oauthId>;
  hasOauths!: Sequelize.HasManyHasAssociationsMixin<oauth, oauthId>;
  countOauths!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany profileMedias via user_id
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
  // users hasMany reports via reported_user_id
  reports!: reports[];
  getReports!: Sequelize.HasManyGetAssociationsMixin<reports>;
  setReports!: Sequelize.HasManySetAssociationsMixin<reports, reportsId>;
  addReport!: Sequelize.HasManyAddAssociationMixin<reports, reportsId>;
  addReports!: Sequelize.HasManyAddAssociationsMixin<reports, reportsId>;
  createReport!: Sequelize.HasManyCreateAssociationMixin<reports>;
  removeReport!: Sequelize.HasManyRemoveAssociationMixin<reports, reportsId>;
  removeReports!: Sequelize.HasManyRemoveAssociationsMixin<reports, reportsId>;
  hasReport!: Sequelize.HasManyHasAssociationMixin<reports, reportsId>;
  hasReports!: Sequelize.HasManyHasAssociationsMixin<reports, reportsId>;
  countReports!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany reports via reporting_user_id
  reporting_user_reports!: reports[];
  getReporting_user_reports!: Sequelize.HasManyGetAssociationsMixin<reports>;
  setReporting_user_reports!: Sequelize.HasManySetAssociationsMixin<reports, reportsId>;
  addReporting_user_report!: Sequelize.HasManyAddAssociationMixin<reports, reportsId>;
  addReporting_user_reports!: Sequelize.HasManyAddAssociationsMixin<reports, reportsId>;
  createReporting_user_report!: Sequelize.HasManyCreateAssociationMixin<reports>;
  removeReporting_user_report!: Sequelize.HasManyRemoveAssociationMixin<reports, reportsId>;
  removeReporting_user_reports!: Sequelize.HasManyRemoveAssociationsMixin<reports, reportsId>;
  hasReporting_user_report!: Sequelize.HasManyHasAssociationMixin<reports, reportsId>;
  hasReporting_user_reports!: Sequelize.HasManyHasAssociationsMixin<reports, reportsId>;
  countReporting_user_reports!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany settings via user_id
  settings!: settings[];
  getSettings!: Sequelize.HasManyGetAssociationsMixin<settings>;
  setSettings!: Sequelize.HasManySetAssociationsMixin<settings, settingsId>;
  addSetting!: Sequelize.HasManyAddAssociationMixin<settings, settingsId>;
  addSettings!: Sequelize.HasManyAddAssociationsMixin<settings, settingsId>;
  createSetting!: Sequelize.HasManyCreateAssociationMixin<settings>;
  removeSetting!: Sequelize.HasManyRemoveAssociationMixin<settings, settingsId>;
  removeSettings!: Sequelize.HasManyRemoveAssociationsMixin<settings, settingsId>;
  hasSetting!: Sequelize.HasManyHasAssociationMixin<settings, settingsId>;
  hasSettings!: Sequelize.HasManyHasAssociationsMixin<settings, settingsId>;
  countSettings!: Sequelize.HasManyCountAssociationsMixin;
  // users hasMany verifications via user_id
  verifications!: verifications[];
  getVerifications!: Sequelize.HasManyGetAssociationsMixin<verifications>;
  setVerifications!: Sequelize.HasManySetAssociationsMixin<verifications, verificationsId>;
  addVerification!: Sequelize.HasManyAddAssociationMixin<verifications, verificationsId>;
  addVerifications!: Sequelize.HasManyAddAssociationsMixin<verifications, verificationsId>;
  createVerification!: Sequelize.HasManyCreateAssociationMixin<verifications>;
  removeVerification!: Sequelize.HasManyRemoveAssociationMixin<verifications, verificationsId>;
  removeVerifications!: Sequelize.HasManyRemoveAssociationsMixin<verifications, verificationsId>;
  hasVerification!: Sequelize.HasManyHasAssociationMixin<verifications, verificationsId>;
  hasVerifications!: Sequelize.HasManyHasAssociationsMixin<verifications, verificationsId>;
  countVerifications!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "unique_email"
    },
    hashed_password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    provider_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'genders',
        key: 'gender_id'
      }
    },
    profile_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_profile_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    height: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    body_type_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'body_types',
        key: 'body_type_id'
      }
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "idx_email",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "unique_email",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
