import store from "./Store.js"
import Login, { PREVIOUS_LOCATION } from "../containers/Login.js"
import Bills  from "../containers/Bills.js"
import NewBill from "../containers/NewBill.js"
import Dashboard from "../containers/Dashboard.js"

import BillsUI from "../views/BillsUI.js"
import DashboardUI from "../views/DashboardUI.js"

import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

export default () => {
  const rootDiv = document.getElementById('root')
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname })


  console.log('window.location.pathname', window.location.pathname);

  window.onNavigate = (pathname) => {

    window.history.pushState(
      {},
      pathname,
      window.location.origin + pathname
    )


    if (pathname === ROUTES_PATH['Login']) {
      rootDiv.innerHTML = ROUTES({ pathname })
      document.body.style.backgroundColor="#0E5AE5"
      new Login({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store })
    } else if (pathname === ROUTES_PATH['Bills']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      const divIcon1 = document.getElementById('layout-icon1')
      const divIcon2 = document.getElementById('layout-icon2')
      divIcon1.classList.add('active-icon')
      divIcon2.classList.remove('active-icon')
      const bills = new Bills({ document, onNavigate, store, localStorage  })
      bills.getBills().then(data => {
        rootDiv.innerHTML = BillsUI({ data })
        const divIcon1 = document.getElementById('layout-icon1')
        const divIcon2 = document.getElementById('layout-icon2')
        divIcon1.classList.add('active-icon')
        divIcon2.classList.remove('active-icon')
        new Bills({ document, onNavigate, store, localStorage })
      }).catch(error => {
        rootDiv.innerHTML = ROUTES({ pathname, error })
      })
    } else if (pathname === ROUTES_PATH['NewBill']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      new NewBill({ document, onNavigate, store, localStorage })
      const divIcon1 = document.getElementById('layout-icon1')
      const divIcon2 = document.getElementById('layout-icon2')
      divIcon1.classList.remove('active-icon')
      divIcon2.classList.add('active-icon')
    } else if (pathname === ROUTES_PATH['Dashboard']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      const bills = new Dashboard({ document, onNavigate, store, bills: [], localStorage })
      bills.getBillsAllUsers().then(bills => {
          rootDiv.innerHTML = DashboardUI({data: {bills}})
          new Dashboard({document, onNavigate, store, bills, localStorage})
        }).catch(error => {
        rootDiv.innerHTML = ROUTES({ pathname, error })
      })
    }
  }

  window.onpopstate = (e) => {

    console.log(' EVENT : onpopstate')
    const user = JSON.parse(localStorage.getItem('user'))
    if (window.location.pathname === "/" && !user) {
      console.log('CASE : EVENT onpopstate && pathname / or no user => ROUTES(pathname)')
      document.body.style.backgroundColor="#0E5AE5"
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname })
    }
    else if (user) {
      console.log('CASE : EVENT onpopstate && user = true  => onNavigate(PL)' )
      onNavigate(PREVIOUS_LOCATION)
    }
  }

  if (window.location.pathname === "/" && window.location.hash === "") {
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('CASE / && no hash => newLogin')
    console.log('--- OBJET : PREVIOUS_LOCATION', PREVIOUS_LOCATION)
    console.log('------------------------------------------------------')
    console.log('--- OBJET : document', document)
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')
    console.log('------------------------------------------------------')

    new Login({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store })
    document.body.style.backgroundColor="#0E5AE5"



  } else if (window.location.hash !== "") {


    console.log(' CASE : hast exists <=> ROUTES_PATH[\'Bill\'] ... ROUTES_PATH[\'NewBill\'] ...')



    if (window.location.hash === ROUTES_PATH['Bills']) {

      console.log('---------hash------==--------RP Bills-------------------------------')

      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })
      const divIcon1 = document.getElementById('layout-icon1')
      const divIcon2 = document.getElementById('layout-icon2')
      divIcon1.classList.add('active-icon')
      divIcon2.classList.remove('active-icon')


      console.log('----------new Bills------------with no PL--------------------------------')

      const bills = new Bills({ document, onNavigate, store, localStorage  })
      bills.getBills().then(data => {
        rootDiv.innerHTML = BillsUI({ data })
        const divIcon1 = document.getElementById('layout-icon1')
        const divIcon2 = document.getElementById('layout-icon2')
        divIcon1.classList.add('active-icon')
        divIcon2.classList.remove('active-icon')

        console.log('--------------new Bills()-- with no PL --------------------------------------')
        new Bills({ document, onNavigate, store, localStorage })



      }).catch(error => {
        rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error })
      })


    } else if (window.location.hash === ROUTES_PATH['NewBill']) {


      console.log('---------hash------===------RP NewBill---------------------------------')


      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })


      console.log('----------------new newBill()---with no PL-----------------------------------')
      new NewBill({ document, onNavigate, store, localStorage })
      const divIcon1 = document.getElementById('layout-icon1')
      const divIcon2 = document.getElementById('layout-icon2')
      divIcon1.classList.remove('active-icon')
      divIcon2.classList.add('active-icon')

    } else if (window.location.hash === ROUTES_PATH['Dashboard']) {


      console.log('----------hash----------------RP Dashboard----------------------------')

      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })

      console.log('--------------new Dashboard --------with no PL -------empty bills[]-------------------------')

      
      const bills = new Dashboard({ document, onNavigate, store, bills: [], localStorage })

      bills.getBillsAllUsers().then(bills => {
        rootDiv.innerHTML = DashboardUI({ data: { bills } })
        new Dashboard({ document, onNavigate, store, bills, localStorage })

        console.log('-------------new Dashboard---------with no PL-------------filled bills[]-------------------')

      }).catch(error => {
        rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error })
      })


    }
  }

  return null
}

