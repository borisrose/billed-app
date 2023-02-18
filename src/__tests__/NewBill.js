/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", async() => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toBeTruthy()
    })
  })

  describe("When I  upload a file", () => {

    test("Then the file should be uploaded only if .jpg, .jpeg ou .png", async() => {

      const file = screen.getByTestId("file")

      if()

    })


  })
})


handleChangeFile = e => {
  e.preventDefault()
  const file = this.document.querySelector(`input[data-testid="file"]`).files[0]

  if(! file.endsWith('.jpg') || ! file.endsWith('.jpeg') || ! file.endsWith('.png')){
    return
  }
  const filePath = e.target.value.split(/\\/g)
  console.log('filePath', filePath)
  const fileName = filePath[filePath.length-1]
  const formData = new FormData()
  const email = JSON.parse(localStorage.getItem("user")).email
  formData.append('file', file)
  formData.append('email', email)

  this.store
    .bills()
    .create({
      data: formData,
      headers: {
        noContentType: true
      }
    })
    .then(({fileUrl, key}) => {
      console.log(fileUrl)
      this.billId = key
      this.fileUrl = fileUrl
      this.fileName = fileName
    }).catch(error => console.error(error))
}