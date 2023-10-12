import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { reportStages, reportStagesId } from './report_stages';
import type { users, usersId } from './users';

export interface reportsAttributes {
  report_id: string;
  reporting_user_id: string;
  reported_user_id: string;
  reason: string;
  created_at: Date;
  report_stage_id: string;
  updated_at: Date;
}

export type reportsPk = "report_id";
export type reportsId = reports[reportsPk];
export type reportsOptionalAttributes = "created_at" | "updated_at";
export type reportsCreationAttributes = Optional<reportsAttributes, reportsOptionalAttributes>;

export class reports extends Model<reportsAttributes | reportsCreationAttributes> implements reportsAttributes {
  report_id!: string;
  reporting_user_id!: string;
  reported_user_id!: string;
  reason!: string;
  created_at!: Date;
  report_stage_id!: string;
  updated_at!: Date;

  // reports belongsTo reportStages via report_stage_id
  report_stage!: reportStages;
  getReport_stage!: Sequelize.BelongsToGetAssociationMixin<reportStages>;
  setReport_stage!: Sequelize.BelongsToSetAssociationMixin<reportStages, reportStagesId>;
  createReport_stage!: Sequelize.BelongsToCreateAssociationMixin<reportStages>;
  // reports belongsTo users via reported_user_id
  reported_user!: users;
  getReported_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setReported_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createReported_user!: Sequelize.BelongsToCreateAssociationMixin<users>;
  // reports belongsTo users via reporting_user_id
  reporting_user!: users;
  getReporting_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setReporting_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createReporting_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof reports {
    return reports.init({
    report_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    reporting_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    reported_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    report_stage_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'report_stages',
        key: 'report_stage_id'
      }
    }
  }, {
    sequelize,
    tableName: 'reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "reports_pkey",
        unique: true,
        fields: [
          { name: "report_id" },
        ]
      },
    ]
  });
  }
}
