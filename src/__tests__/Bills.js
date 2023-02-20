/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES,  ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import newBills from "../containers/Bills"
import mockStore from "../__mocks__/store"
jest.mock("../app/store", () => mockStore)

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";




// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId("tbody"))
      const tbody = screen.getByTestId("tbody")
      expect(Array.from(tbody.childNodes).length).not.toBe(0)
    
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "employee@test.tld"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(Array.from((windowIcon).classList)[0]).toBe('active-icon')

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

   

  })


  describe("When I am on Bills Page and I click on icon eye", () => {

  

    test("Then it should show me the bill", async() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      
      document.body.innerHTML = BillsUI({ data: bills })
      const store = null

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsNew = new newBills({
        document, onNavigate, store, localStorage,
      })

      const handleClickIconEye = jest.fn(billsNew.handleClickIconEye)
      await waitFor(() => screen.getAllByTestId('icon-eye'))

      
      eye = screen.getAllByTestId('icon-eye')
      eye.forEach(element => {
        expect(element).toHaveAttribute('data-bill-url')
      });
    
   
    })
  })
    





  describe("When I am on Bills Pages and I click on new bILL", () => {

    test("it should go to the new bill page", async() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
     
      document.body.innerHTML = BillsUI({ data: bills })
      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const eyeIcon = screen.getAllByTestId('icon-eye')

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const new_bills = new newBills({document, onNavigate, mockStore, localStorage})

      const mockHandleNewBillClick = jest.fn(new_bills.handleNewBillClick)

      const button = screen.getByTestId('btn-new-bill')

      button.addEventListener("click",mockHandleNewBillClick)
      userEvent.click(button)

      expect(mockHandleNewBillClick).toBeCalled()

     

    })

  })
})

