import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { interactionTypes, interactionTypesId } from './interaction_types';
import type { users, usersId } from './users';

export interface interactionsAttributes {
  interaction_id: string;
  user1_id: string;
  user2_id: string;
  interaction_type_id: string;
  created_at: Date;
  updated_at: Date;
}

export type interactionsPk = "interaction_id";
export type interactionsId = interactions[interactionsPk];
export type interactionsOptionalAttributes = "created_at" | "updated_at";
export type interactionsCreationAttributes = Optional<interactionsAttributes, interactionsOptionalAttributes>;

export class interactions extends Model<interactionsAttributes | interactionsCreationAttributes> implements interactionsAttributes {
  interaction_id!: string;
  user1_id!: string;
  user2_id!: string;
  interaction_type_id!: string;
  created_at!: Date;
  updated_at!: Date;

  // interactions belongsTo interactionTypes via interaction_type_id
  interaction_type!: interactionTypes;
  getInteraction_type!: Sequelize.BelongsToGetAssociationMixin<interactionTypes>;
  setInteraction_type!: Sequelize.BelongsToSetAssociationMixin<interactionTypes, interactionTypesId>;
  createInteraction_type!: Sequelize.BelongsToCreateAssociationMixin<interactionTypes>;
  // interactions belongsTo users via user1_id
  user1!: users;
  getUser1!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser1!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser1!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // interactions belongsTo users via user2_id
  user2!: users;
  getUser2!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser2!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser2!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof interactions {
    return interactions.init({
    interaction_id: {
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
    interaction_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'interaction_types',
        key: 'interaction_type_id'
      }
    }
  }, {
    sequelize,
    tableName: 'interactions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "interactions_pkey",
        unique: true,
        fields: [
          { name: "interaction_id" },
        ]
      },
    ]
  });
  }
}
