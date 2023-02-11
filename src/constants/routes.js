import LoginUI from "../views/LoginUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBillUI from "../views/NewBillUI.js"
import DashboardUI from "../views/DashboardUI.js"

export const ROUTES_PATH = {
  Login: '/',
  Bills: '#employee/bills',
  NewBill : '#employee/bill/new',
  Dashboard: '#admin/dashboard'
}

export const ROUTES = ({ pathname, data, error, loading }) => {
  switch (pathname) {
    case ROUTES_PATH['Login']:
      console.log('Login')
      return LoginUI({ data, error, loading })
    case ROUTES_PATH['Bills']:
      console.log('Bills')
      
      return BillsUI({ data, error, loading })
    case ROUTES_PATH['NewBill']:
      console.log('New Bill')
      
      return NewBillUI()
    case ROUTES_PATH['Dashboard']:
      console.log('dashboard')

      
      return DashboardUI({ data, error, loading })
    default:
      console.log('in routes.js')
      console.log('default')
      
      return LoginUI()
  }
}

