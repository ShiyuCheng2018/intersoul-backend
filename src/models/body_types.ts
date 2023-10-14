import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface body_typesAttributes {
  body_type_id: string;
  body_type: string;
  updated_at: Date;
}

export type body_typesPk = "body_type_id";
export type body_typesId = body_types[body_typesPk];
export type body_typesOptionalAttributes = "body_type_id" | "updated_at";
export type body_typesCreationAttributes = Optional<body_typesAttributes, body_typesOptionalAttributes>;

export class body_types extends Model<body_typesAttributes | body_typesCreationAttributes> implements body_typesAttributes {
  body_type_id!: string;
  body_type!: string;
  updated_at!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof body_types {
    return body_types.init({
    body_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    body_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'body_types',
    schema: 'public',
    updatedAt: 'updated_at',
    createdAt: false,
    indexes: [
      {
        name: "body_types_pkey",
        unique: true,
        fields: [
          { name: "body_type_id" },
        ]
      },
    ]
  });
  }
}
