import type { Sequelize } from "sequelize";
import { chats as _chats } from "./chats";
import type { chatsAttributes, chatsCreationAttributes } from "./chats";
import { genders as _genders } from "./genders";
import type { gendersAttributes, gendersCreationAttributes } from "./genders";
import { interactionTypes as _interactionTypes } from "./interaction_types";
import type { interactionTypesAttributes, interactionTypesCreationAttributes } from "./interaction_types";
import { interactions as _interactions } from "./interactions";
import type { interactionsAttributes, interactionsCreationAttributes } from "./interactions";
import { locations as _locations } from "./locations";
import type { locationsAttributes, locationsCreationAttributes } from "./locations";
import { mediaTypes as _mediaTypes } from "./media_types";
import type { mediaTypesAttributes, mediaTypesCreationAttributes } from "./media_types";
import { messages as _messages } from "./messages";
import type { messagesAttributes, messagesCreationAttributes } from "./messages";
import { oauth as _oauth } from "./oauth";
import type { oauthAttributes, oauthCreationAttributes } from "./oauth";
import { profileMedias as _profileMedias } from "./profile_medias";
import type { profileMediasAttributes, profileMediasCreationAttributes } from "./profile_medias";
import { reportStages as _reportStages } from "./report_stages";
import type { reportStagesAttributes, reportStagesCreationAttributes } from "./report_stages";
import { reports as _reports } from "./reports";
import type { reportsAttributes, reportsCreationAttributes } from "./reports";
import { settings as _settings } from "./settings";
import type { settingsAttributes, settingsCreationAttributes } from "./settings";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";
import { verifications as _verifications } from "./verifications";
import type { verificationsAttributes, verificationsCreationAttributes } from "./verifications";
import { body_types as _body_types } from "../models/body_types";
import type { body_typesAttributes, body_typesCreationAttributes } from "./body_types";
import { preferences as _preferences } from "./preferences";
import type { preferencesAttributes, preferencesCreationAttributes } from "./preferences";

export {
  _chats as chats,
  _genders as genders,
  _interactionTypes as interactionTypes,
  _interactions as interactions,
  _locations as locations,
  _mediaTypes as mediaTypes,
  _messages as messages,
  _oauth as oauth,
  _profileMedias as profileMedias,
  _reportStages as reportStages,
  _reports as reports,
  _settings as settings,
  _users as users,
  _verifications as verifications,
  _body_types as body_types,
  _preferences as preferences,
};

export type {
  chatsAttributes,
  chatsCreationAttributes,
  gendersAttributes,
  gendersCreationAttributes,
  interactionTypesAttributes,
  interactionTypesCreationAttributes,
  interactionsAttributes,
  interactionsCreationAttributes,
  locationsAttributes,
  locationsCreationAttributes,
  mediaTypesAttributes,
  mediaTypesCreationAttributes,
  messagesAttributes,
  messagesCreationAttributes,
  oauthAttributes,
  oauthCreationAttributes,
  profileMediasAttributes,
  profileMediasCreationAttributes,
  reportStagesAttributes,
  reportStagesCreationAttributes,
  reportsAttributes,
  reportsCreationAttributes,
  settingsAttributes,
  settingsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
  verificationsAttributes,
  verificationsCreationAttributes,
  body_typesAttributes,
  body_typesCreationAttributes,
  preferencesAttributes,
  preferencesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const chats = _chats.initModel(sequelize);
  const genders = _genders.initModel(sequelize);
  const interactionTypes = _interactionTypes.initModel(sequelize);
  const interactions = _interactions.initModel(sequelize);
  const locations = _locations.initModel(sequelize);
  const mediaTypes = _mediaTypes.initModel(sequelize);
  const messages = _messages.initModel(sequelize);
  const oauth = _oauth.initModel(sequelize);
  const profileMedias = _profileMedias.initModel(sequelize);
  const reportStages = _reportStages.initModel(sequelize);
  const reports = _reports.initModel(sequelize);
  const settings = _settings.initModel(sequelize);
  const users = _users.initModel(sequelize);
  const verifications = _verifications.initModel(sequelize);
  const body_types = _body_types.initModel(sequelize);
  const preferences = _preferences.initModel(sequelize);

  users.belongsTo(body_types, { as: "body_type", foreignKey: "body_type_id"});
  body_types.hasMany(users, { as: "users", foreignKey: "body_type_id"});
  messages.belongsTo(chats, { as: "chat", foreignKey: "chat_id"});
  chats.hasMany(messages, { as: "messages", foreignKey: "chat_id"});
  users.belongsTo(genders, { as: "gender", foreignKey: "gender_id"});
  genders.hasMany(users, { as: "users", foreignKey: "gender_id"});
  interactions.belongsTo(interactionTypes, { as: "interaction_type", foreignKey: "interaction_type_id"});
  interactionTypes.hasMany(interactions, { as: "interactions", foreignKey: "interaction_type_id"});
  messages.belongsTo(mediaTypes, { as: "content_type", foreignKey: "content_type_id"});
  mediaTypes.hasMany(messages, { as: "messages", foreignKey: "content_type_id"});
  profileMedias.belongsTo(mediaTypes, { as: "profile_media_type", foreignKey: "profile_media_type_id"});
  mediaTypes.hasMany(profileMedias, { as: "profile_media", foreignKey: "profile_media_type_id"});
  reports.belongsTo(reportStages, { as: "report_stage", foreignKey: "report_stage_id"});
  reportStages.hasMany(reports, { as: "reports", foreignKey: "report_stage_id"});
  chats.belongsTo(users, { as: "user1", foreignKey: "user1_id"});
  users.hasMany(chats, { as: "chats", foreignKey: "user1_id"});
  chats.belongsTo(users, { as: "user2", foreignKey: "user2_id"});
  users.hasMany(chats, { as: "user2_chats", foreignKey: "user2_id"});
  interactions.belongsTo(users, { as: "user1", foreignKey: "user1_id"});
  users.hasMany(interactions, { as: "interactions", foreignKey: "user1_id"});
  interactions.belongsTo(users, { as: "user2", foreignKey: "user2_id"});
  users.hasMany(interactions, { as: "user2_interactions", foreignKey: "user2_id"});
  locations.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(locations, { as: "locations", foreignKey: "user_id"});
  messages.belongsTo(users, { as: "recipient", foreignKey: "recipient_id"});
  users.hasMany(messages, { as: "messages", foreignKey: "recipient_id"});
  messages.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(messages, { as: "sender_messages", foreignKey: "sender_id"});
  oauth.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(oauth, { as: "oauths", foreignKey: "user_id"});
  profileMedias.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(profileMedias, { as: "profile_media", foreignKey: "user_id"});
  reports.belongsTo(users, { as: "reported_user", foreignKey: "reported_user_id"});
  users.hasMany(reports, { as: "reports", foreignKey: "reported_user_id"});
  reports.belongsTo(users, { as: "reporting_user", foreignKey: "reporting_user_id"});
  users.hasMany(reports, { as: "reporting_user_reports", foreignKey: "reporting_user_id"});
  settings.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(settings, { as: "settings", foreignKey: "user_id"});
  verifications.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(verifications, { as: "verifications", foreignKey: "user_id"});
  preferences.belongsTo(body_types, { as: "body_type_preference", foreignKey: "body_type_preference_id"});
  body_types.hasMany(preferences, { as: "preferences", foreignKey: "body_type_preference_id"});
  preferences.belongsTo(genders, { as: "gender_preference", foreignKey: "gender_preference_id"});
  genders.hasMany(preferences, { as: "preferences", foreignKey: "gender_preference_id"});
  preferences.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(preferences, { as: "preferences", foreignKey: "user_id"});

  return {
    chats: chats,
    genders: genders,
    interactionTypes: interactionTypes,
    interactions: interactions,
    locations: locations,
    mediaTypes: mediaTypes,
    messages: messages,
    oauth: oauth,
    profileMedias: profileMedias,
    reportStages: reportStages,
    reports: reports,
    settings: settings,
    users: users,
    verifications: verifications,
    body_types: body_types,
    preferences: preferences,
  };
}
