import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { chats, chatsId } from './chats';
import type { mediaTypes, mediaTypesId } from './media_types';
import type { users, usersId } from './users';

export interface messagesAttributes {
  message_id: number;
  chat_id: string;
  sender_id: string;
  recipient_id: string;
  content_type_id: string;
  content_link: string;
  content_status: string;
  message_status: string;
  sent_at: Date;
  expiry_time?: Date;
}

export type messagesPk = "message_id";
export type messagesId = messages[messagesPk];
export type messagesOptionalAttributes = "message_id" | "expiry_time";
export type messagesCreationAttributes = Optional<messagesAttributes, messagesOptionalAttributes>;

export class messages extends Model<messagesAttributes, messagesCreationAttributes> implements messagesAttributes {
  message_id!: number;
  chat_id!: string;
  sender_id!: string;
  recipient_id!: string;
  content_type_id!: string;
  content_link!: string;
  content_status!: string;
  message_status!: string;
  sent_at!: Date;
  expiry_time?: Date;

  // messages belongsTo chats via chat_id
  chat!: chats;
  getChat!: Sequelize.BelongsToGetAssociationMixin<chats>;
  setChat!: Sequelize.BelongsToSetAssociationMixin<chats, chatsId>;
  createChat!: Sequelize.BelongsToCreateAssociationMixin<chats>;
  // messages belongsTo mediaTypes via content_type_id
  content_type!: mediaTypes;
  getContent_type!: Sequelize.BelongsToGetAssociationMixin<mediaTypes>;
  setContent_type!: Sequelize.BelongsToSetAssociationMixin<mediaTypes, mediaTypesId>;
  createContent_type!: Sequelize.BelongsToCreateAssociationMixin<mediaTypes>;
  // messages belongsTo users via recipient_id
  recipient!: users;
  getRecipient!: Sequelize.BelongsToGetAssociationMixin<users>;
  setRecipient!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createRecipient!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // messages belongsTo users via sender_id
  sender!: users;
  getSender!: Sequelize.BelongsToGetAssociationMixin<users>;
  setSender!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createSender!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof messages {
    return messages.init({
    message_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'chats',
        key: 'chat_id'
      }
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    recipient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    content_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media_types',
        key: 'media_type_id'
      }
    },
    content_link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expiry_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'messages',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "messages_pkey",
        unique: true,
        fields: [
          { name: "message_id" },
        ]
      },
    ]
  });
  }
}
