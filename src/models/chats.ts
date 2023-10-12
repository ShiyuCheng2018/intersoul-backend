import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { messages, messagesId } from './messages';
import type { users, usersId } from './users';

export interface chatsAttributes {
  chat_id: string;
  user1_id: string;
  user2_id: string;
  last_message_timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

export type chatsPk = "chat_id";
export type chatsId = chats[chatsPk];
export type chatsOptionalAttributes = "created_at" | "updated_at";
export type chatsCreationAttributes = Optional<chatsAttributes, chatsOptionalAttributes>;

export class chats extends Model<chatsAttributes | chatsCreationAttributes> implements chatsAttributes {
  chat_id!: string;
  user1_id!: string;
  user2_id!: string;
  last_message_timestamp!: Date;
  created_at!: Date;
  updated_at!: Date;

  // chats hasMany messages via chat_id
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
  // chats belongsTo users via user1_id
  user1!: users;
  getUser1!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser1!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser1!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // chats belongsTo users via user2_id
  user2!: users;
  getUser2!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser2!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser2!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof chats {
    return chats.init({
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    user1_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    user2_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    last_message_timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chats',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chats_pkey",
        unique: true,
        fields: [
          { name: "chat_id" },
        ]
      },
    ]
  });
  }
}
