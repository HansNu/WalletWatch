const baseUrl = 'http://localhost:4200/api/'

export const urlconstant = {
  baseUrl,
  //user
  getUserByUserId : `${baseUrl}user/getUserByUserId`,

  //account
  getTotalBalanceByUserId : `${baseUrl}account/getTotalBalanceByUserId`,
  getLiabilitiesByUserId : `${baseUrl}account/getLiabilitiesByUserId`,
  updateIncomeByAccountId : `${baseUrl}account/updateIncomeByAccountId`,
  getAccountByUserId : `${baseUrl}account/getAccountByUserId`,
  deleteAccountByAccountId : `${baseUrl}account/deleteAccountByAccountId`,
  addNewAccount : `${baseUrl}account/addNewAccount`,
  updateAccount : `${baseUrl}account/updateAccount`,
  

  //transaction
  getIncomeExpenseByUserIdAndTransactionType : `${baseUrl}transaction/getIncomeExpenseByUserIdAndTransactionType`,
  getLatestTransactionRecord : `${baseUrl}transaction/getLatestTransactionRecord`,
  addNewTransaction : `${baseUrl}transaction/addNewTransaction`,

}