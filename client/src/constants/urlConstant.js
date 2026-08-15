// The server now serves the built client itself (see server/index.js),
// so API calls are same-origin in production and a relative path works
// everywhere: EC2, local `vite build` preview, etc.
// In local dev (`npm run dev`), Vite's proxy (see vite.config.js) forwards
// this same '/api' path to the backend running on a different port.
const liveBaseUrl = '/api/'

export const urlconstant = {
  liveBaseUrl,
  //user
  getUserByUserId : `${liveBaseUrl}user/getUserByUserId`,
  updateUserData : `${liveBaseUrl}user/updateUserData`,
  
  //account
  getTotalBalanceByUserId : `${liveBaseUrl}account/getTotalBalanceByUserId`,
  getLiabilitiesByUserId : `${liveBaseUrl}account/getLiabilitiesByUserId`,
  updateIncomeByAccountId : `${liveBaseUrl}account/updateIncomeByAccountId`,
  updateExpenseByAccountId : `${liveBaseUrl}account/updateExpenseByAccountId`,
  getAccountByUserId : `${liveBaseUrl}account/getAccountByUserId`,
  deleteAccountByAccountId : `${liveBaseUrl}account/deleteAccountByAccountId`,
  addNewAccount : `${liveBaseUrl}account/addNewAccount`,
  updateAccount : `${liveBaseUrl}account/updateAccount`,
  

  //transaction
  getIncomeExpenseByUserIdAndTransactionType : `${liveBaseUrl}transaction/getIncomeExpenseByUserIdAndTransactionType`,
  getLatestTransactionRecord : `${liveBaseUrl}transaction/getLatestTransactionRecord`,
  getLatestTransactionRecordByCategory : `${liveBaseUrl}transaction/getLatestTransactionRecordByCategory`,
  addNewTransaction : `${liveBaseUrl}transaction/addNewTransaction`,
  getTransactionBasedOnUserIdAndDateRange : `${liveBaseUrl}transaction/getTransactionBasedOnUserIdAndDateRange`,

  //budget
  getBudgetByBudgetId : `${liveBaseUrl}budget/getBudgetByBudgetId`,
  getBudgetByUserId : `${liveBaseUrl}budget/getBudgetByUserId`,
  addNewBudget: `${liveBaseUrl}budget/addNewBudget`,
  updateBudget: `${liveBaseUrl}budget/updateBudget`,

  //category
  getTransactionCategoryByBudgetId : `${liveBaseUrl}category/getTransactionCategoryByBudgetId`,
  addTransactionCategory : `${liveBaseUrl}category/addNewTransactionCategory`,
  updateTransactionCategory : `${liveBaseUrl}category/updateTransactionCategory`,
  deleteTransactionCategory : `${liveBaseUrl}category/deleteTransactionCategory`,
  
}