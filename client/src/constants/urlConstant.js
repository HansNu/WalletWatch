const baseUrl = 'http://localhost:4200/api/'

export const urlconstant = {
  baseUrl,
  //user
  getUserByUserId : `${baseUrl}user/getUserByUserId`,

  //account
  getTotalBalanceByUserId : `${baseUrl}account/getTotalBalanceByUserId`,


  //transaction
  getIncomeExpenseByUserIdAndTransactionType : `${baseUrl}transaction/getIncomeExpenseByUserIdAndTransactionType`
}