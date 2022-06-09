let errorCode = require('../ErrorCode/code.json')

/**
 * save data
 * @param {any} self           table info
 * @param {string} rowsData    multiple rows of data
 */
const AddDataSQL = function(self, rowsData){  
  let args = format(self.id_name, rowsData, self.dbConstruct)

  if(args && args.length){
    let tableTitle = `${self.table_name}(` + Object.keys(self.dbConstruct).join(",") + ')'
    let v = getValues(args)
    let sql = `INSERT INTO ${tableTitle} VALUES${v}`;
    return sql
  }else{
    return errorCode['100001']
  }
}

/**
 * Canonical data structure
 * @param {*} idName 
 * @param {*} rowsData 
 * @param {*} dbConstruct 
 */
function format(idName, rowsData, dbConstruct){
  let newData = rowsData && Array.isArray(rowsData) ? rowsData : [rowsData]
  let args = [];
  // Adjust the order according to the table structure, add id
  for (let i = 0; i < newData.length;i++){
    let row = newData[i]
    if(row && !row[idName]){
      delete dbConstruct[idName]
    }
    // console.log(dbConstruct, '======')
    // row[idName] = row[idName] ? row[idName] : uuid(15)
    if(row){
      let arg = sortArg(row, dbConstruct);
      args.push(arg)
    }
  }

  return args
}

/**
 * Generate sql statement
 * @param {*} args 
 */
function getValues(args){ // [{a: '111', b:'222'}]  || {a: '111', b:'222'}
  if(!Array.isArray(args)){getValues([args])}
  let v = ""
  let signal = "'" // Hard-coded as single quotes
  for(let i=0;i<args.length;i++){
    let newVal = ''
    let vs = args[i]
    let keyObj = Object.values(vs) // ['111', '222']
    keyObj.forEach(function (value, index) {
      if(value || value === 0 || typeof value === 'string'){

        // Special treatment of single and double quotes
        // There are double quotes and single quotes at the same time Replace all single quotes with double quotes
        if(signal==="'" && typeof value === 'string' && value.includes("'")){
          value = value.replace(/\'/g, '"')
        }

        newVal += signal + value + signal
      }else{ // If the value does not exist, the unity becomes null
        newVal += null
      }
      if(keyObj.length !== index+1){
        newVal += ','
      }
    })
    let b = ','
    if(args.length === i+1){
      b = ';'
    }
    v += ' (' + newVal + ')' + b;
  }
  return v // ("111","2222",null);
}

/**
 * Adjust the parameter order according to the table structure
 * @param {*} data 
 * @param {*} dbEnum 
 */
function sortArg(data, dbEnum) {
  let ArgEnum = Object.keys(dbEnum);
  let newData = {}
  ArgEnum.forEach(function (key) {
    newData[key] = data[key]
  })
  return newData
}

module.exports = AddDataSQL

// let test = AddDataSQL('userid', 'user', {
//   username: "Make",
//   password: "Moo"
// },{
//   userid: "",
//   username: "",
//   password: "",
//   sex: "",
//   mail: "",
//   phone: "",
//   create_time: "",
//   last_login_time: "",
//   authorized: ""
// })
// console.log(test)