import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { reports, reportsId } from './reports';

export interface reportStagesAttributes {
  report_stage_id: string;
  report_stage?: string;
}

export type reportStagesPk = "report_stage_id";
export type reportStagesId = reportStages[reportStagesPk];
export type reportStagesOptionalAttributes = "report_stage";
export type reportStagesCreationAttributes = Optional<reportStagesAttributes, reportStagesOptionalAttributes>;

export class reportStages extends Model<reportStagesAttributes, reportStagesCreationAttributes> implements reportStagesAttributes {
  report_stage_id!: string;
  report_stage?: string;

  // reportStages hasMany reports via report_stage_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof reportStages {
    return reportStages.init({
    report_stage_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    report_stage: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'report_stages',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "report_stages_pkey",
        unique: true,
        fields: [
          { name: "report_stage_id" },
        ]
      },
    ]
  });
  }
}
