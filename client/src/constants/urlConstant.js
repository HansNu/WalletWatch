const baseUrl = 'http://localhost:4200/api/'

export const urlconstant = {
  baseUrl,
  //user
  getUserByUserId : `${baseUrl}user/getUserByUserId`,

  //account
  getTotalBalanceByUserId : `${baseUrl}account/getTotalBalanceByUserId`,
  getLiabilitiesByUserId : `${baseUrl}account/getLiabilitiesByUserId`,
  updateIncomeByAccountId : `${baseUrl}account/updateIncomeByAccountId`,


  //transaction
  getIncomeExpenseByUserIdAndTransactionType : `${baseUrl}transaction/getIncomeExpenseByUserIdAndTransactionType`,
  getLatestTransactionRecord : `${baseUrl}transaction/getLatestTransactionRecord`,
  addNewTransaction : `${baseUrl}transaction/addNewTransaction`,

}