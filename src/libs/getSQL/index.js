const AddDataSQL = require('./AddDataSQL');
const CreateDatabaseSQL = require('./CreateDatabaseSQL');
const CreateDBTable = require('./CreateDBTable');
const DeleteRowsSQL = require('./DeleteRowsSQL');
const GetPrimaryKeySQL = require('./GetPrimaryKeySQL.js')
const GetAllColumnName = require('./GetAllColumnName.js')
const GetAllRowsSQL = require('./GetAllRowsSQL.js')
const GetAllTableNameSQL = require('./GetAllTableNameSQL.js')
const GetRowsByIdsSQL = require('./GetRowsByIdsSQL.js')
const GetRowsByPageSQL = require('./GetRowsByPageSQL.js')
const GetRowsByWhereSQL = require('./GetRowsByWhereSQL.js')
const IsExistDBSQL = require('./IsExistDBSQL.js')
const UpdateRowSQL = require('./UpdateRowSQL.js')
const UpdateRowsSQL = require('./UpdateRowsSQL.js')
const UpdateSameField = require('./UpdateSameField.js')
const GetCountSQL = require('./GetCountSQL.js')
const AggregSQL = require('./AggregSQL.js')
const GetRowsByLikeSQL = require('./GetRowsByLikeSQL.js')

module.exports = {
  AddDataSQL,
  CreateDatabaseSQL,
  CreateDBTable,
  DeleteRowsSQL,
  GetPrimaryKeySQL,
  GetAllColumnName,
  GetAllRowsSQL,
  GetAllTableNameSQL,
  GetRowsByIdsSQL,
  GetRowsByPageSQL,
  GetRowsByWhereSQL,
  IsExistDBSQL,
  UpdateRowSQL,
  UpdateRowsSQL,
  UpdateSameField,
  GetCountSQL,
  AggregSQL,
  GetRowsByLikeSQL
}