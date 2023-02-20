/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {fireEvent, screen, waitFor, getByTestId} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router"
import BillsUI from "../views/BillsUI.js"


beforeEach(() => {

  document.body.innerHTML = NewBillUI()




})

afterEach(() => {

  document.body.innerHTML = ''
})

describe('NewBill Form Integration Test Suites', () => {

  it('should display return if not format type valid ', () => {

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
 

    const newBill = new NewBill({ document: document, onNavigate, store: mockStore, localStorage})

    fireEvent.change(screen.getByTestId('file'), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
      },
    })


    const fileName  = screen.getByTestId('file').files[0].name 

    expect(fileName).toBe('chucknorris.png')

 
  })


  it('should I click on the submit ...', ()=> {

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }


    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
    }))

    const newBill = new NewBill({ document, onNavigate: onNavigate, mockStore, localStorage})

    const mockSubmitHandler = jest.fn(newBill.handleSubmit)
    
    const button = screen.getByText('Envoyer')
    const send = screen.getByTestId('form-new-bill')
    
    send.addEventListener('submit', mockSubmitHandler)
    userEvent.click(button)

    expect(mockSubmitHandler).toBeCalled()

  })
  
})


describe('When I submit a new bill', () => {

    test("Then  a new bill should be heading to the db", () => {

      const bill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "accepted",
        "type": "Hôtel et logement",
        "commentAdmin": "ok",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "email": "a@a",
        "pct": 20
      }

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
  
  
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
      }))
  
      const newBill = new NewBill({ document, onNavigate: onNavigate, mockStore, localStorage})

      const mockUpdate = jest.fn(newBill.updateBill(bill))


      mockUpdate()
      expect(mockUpdate).toHaveBeenCalled()
  
      
    
      
      
     
    
      


    })



})


// // test d'intégration GET
// describe("Given I am a user connected as Admin", () => {
//   describe("When I navigate to Dashboard", () => {
//     test("fetches bills from mock API GET", async () => {
//       localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
//       const root = document.createElement("div")
//       root.setAttribute("id", "root")
//       document.body.append(root)
//       router()
//       window.onNavigate(ROUTES_PATH.Dashboard)
//       await waitFor(() => screen.getByText("Validations"))
//       const contentPending  = await screen.getByText("En attente (1)")
//       expect(contentPending).toBeTruthy()
//       const contentRefused  = await screen.getByText("Refusé (2)")
//       expect(contentRefused).toBeTruthy()
//       expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
//     })
//   describe("When an error occurs on API", () => {
//     beforeEach(() => {
//       jest.spyOn(mockStore, "bills")
//       Object.defineProperty(
//           window,
//           'localStorage',
//           { value: localStorageMock }
//       )
//       window.localStorage.setItem('user', JSON.stringify({
//         type: 'Admin',
//         email: "a@a"
//       }))
//       const root = document.createElement("div")
//       root.setAttribute("id", "root")
//       document.body.appendChild(root)
//       router()
//     })
//     test("fetches bills from an API and fails with 404 message error", async () => {

//       mockStore.bills.mockImplementationOnce(() => {
//         return {
//           list : () =>  {
//             return Promise.reject(new Error("Erreur 404"))
//           }
//         }})
//       window.onNavigate(ROUTES_PATH.Dashboard)
//       await new Promise(process.nextTick);
//       const message = await screen.getByText(/Erreur 404/)
//       expect(message).toBeTruthy()
//     })

//     test("fetches messages from an API and fails with 500 message error", async () => {

//       mockStore.bills.mockImplementationOnce(() => {
//         return {
//           list : () =>  {
//             return Promise.reject(new Error("Erreur 500"))
//           }
//         }})

//       window.onNavigate(ROUTES_PATH.Dashboard)
//       await new Promise(process.nextTick);
//       const message = await screen.getByText(/Erreur 500/)
//       expect(message).toBeTruthy()
//     })
//   })

//   })
// })

