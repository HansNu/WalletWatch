const baseUrl = 'http://localhost:4200/api/'

export const urlconstant = {
  baseUrl,
  //user
  getUserByUserId : `${baseUrl}user/getUserByUserId`,
  updateUserData : `${baseUrl}user/updateUserData`,
  
  //account
  getTotalBalanceByUserId : `${baseUrl}account/getTotalBalanceByUserId`,
  getLiabilitiesByUserId : `${baseUrl}account/getLiabilitiesByUserId`,
  updateIncomeByAccountId : `${baseUrl}account/updateIncomeByAccountId`,
  updateExpenseByAccountId : `${baseUrl}account/updateExpenseByAccountId`,
  getAccountByUserId : `${baseUrl}account/getAccountByUserId`,
  deleteAccountByAccountId : `${baseUrl}account/deleteAccountByAccountId`,
  addNewAccount : `${baseUrl}account/addNewAccount`,
  updateAccount : `${baseUrl}account/updateAccount`,
  

  //transaction
  getIncomeExpenseByUserIdAndTransactionType : `${baseUrl}transaction/getIncomeExpenseByUserIdAndTransactionType`,
  getLatestTransactionRecord : `${baseUrl}transaction/getLatestTransactionRecord`,
  getLatestTransactionRecordByCategory : `${baseUrl}transaction/getLatestTransactionRecordByCategory`,
  addNewTransaction : `${baseUrl}transaction/addNewTransaction`,
  getTransactionBasedOnUserIdAndDateRange : `${baseUrl}transaction/getTransactionBasedOnUserIdAndDateRange`,

  //budget
  getBudgetByBudgetId : `${baseUrl}budget/getBudgetByBudgetId`,
  getBudgetByUserId : `${baseUrl}budget/getBudgetByUserId`,
  addNewBudget: `${baseUrl}budget/addNewBudget`,
  updateBudget: `${baseUrl}budget/updateBudget`,

  //category
  getTransactionCategoryByBudgetId : `${baseUrl}category/getTransactionCategoryByBudgetId`,
  addTransactionCategory : `${baseUrl}category/addNewTransactionCategory`,
  updateTransactionCategory : `${baseUrl}category/updateTransactionCategory`,
  deleteTransactionCategory : `${baseUrl}category/deleteTransactionCategory`,
  
}