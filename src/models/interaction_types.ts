import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { interactions, interactionsId } from './interactions';

export interface interactionTypesAttributes {
  interaction_type_id: string;
  interaction_type: string;
}

export type interactionTypesPk = "interaction_type_id";
export type interactionTypesId = interactionTypes[interactionTypesPk];
export type interactionTypesCreationAttributes = interactionTypesAttributes;

export class interactionTypes extends Model<interactionTypesAttributes, interactionTypesCreationAttributes> implements interactionTypesAttributes {
  interaction_type_id!: string;
  interaction_type!: string;

  // interactionTypes hasMany interactions via interaction_type_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof interactionTypes {
    return interactionTypes.init({
    interaction_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    interaction_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'interaction_types',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "interaction_types_pkey",
        unique: true,
        fields: [
          { name: "interaction_type_id" },
        ]
      },
    ]
  });
  }
}
