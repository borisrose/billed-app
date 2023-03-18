/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage";
import mockStore from "../__mocks__/store";

import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {



    //declaring 2 variables 
    let onNavigate;
    let container;


    //for all tests start :
    beforeEach(() => {
      // I mke sure the body is the newBillUI
      document.body.innerHTML = NewBillUI();


      // I define the onNavigate variable I previously declared outside the scope of the beforeEach
      onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };


      //I initialize the localStorage through Object.defineProperty
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      //I even set a key to it : "user" and a value, which is JSON formatted 
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

      // I initialize the container I once created
      container = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
    });



    test("Then I should see the new bill form", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });


    describe("When the form is not required-completed", () => {

      test("I should not be able to post anything I remain on that new billpage",() => {
        const newBillForm = screen.getByTestId("form-new-bill");

        const handleSubmit = jest.fn(container.handleSubmit);
        newBillForm.addEventListener("submit", handleSubmit);
        fireEvent.submit(newBillForm);


      })
 


    })
  

    describe("When I add a file in the file input", () => {
      test("Then only files with .png, .jpg and .jpeg should be accepted", async () => {
      
        const fileInput = screen.getByTestId("file");
        const handleChangeFile = jest.fn(container.handleChangeFile);
        //creating a mocked changefile handler 

        fileInput.addEventListener("change", handleChangeFile);
        //adding an event handler to fileInput which represents the HTML Element Input


        const errMessage = screen.getByTestId("file-input-error-message");
      
        const fakeFiles = [
          new File(["bo"], "fakeFile.png", { type: "image/png" }),
          new File(["ri"], "fakeFile.jpg", { type: "image/jpg" }),
          new File(["s"], "fakeFile.jpeg", {
            type: "image/jpeg",
          }),
        ];

        // For jpg, jpeg, and png files
        //firing change event for every file to test them all
        fakeFiles.forEach((file) => {
          fireEvent.change(fileInput, { target: { files: [file] } });
          userEvent.upload(fileInput, file);
          expect(handleChangeFile).toHaveBeenCalled();
          expect(fileInput.files[0]).toStrictEqual(file);
          // sign that everything went A-OK
          expect(errMessage.classList[1]).toEqual("hide");
        });

        // For wrong file type
        const wrongFakeFile = new File(["uWu"], "fakeFile.gif", {
          type: "image/gif",
        });
        fireEvent.change(fileInput, {
          target: { files: [wrongFakeFile] },
        });
        userEvent.upload(fileInput, wrongFakeFile);
        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.files[0]).toStrictEqual(wrongFakeFile);
        expect(errMessage.classList.length).toEqual(1);
        //sign that it went south
        expect(screen.getByText(
            "Ce fichier n'est pas supporté, veuillez choisir un fichier jpeg, jpg, ou png."
        )).toBeTruthy();
      });
    });

    describe("When I click on submit button", () => {
      test("Then the billsUI page should loaded", () => {
        const newBillForm = screen.getByTestId("form-new-bill");

        const handleSubmit = jest.fn(container.handleSubmit);
        newBillForm.addEventListener("submit", handleSubmit);
        fireEvent.submit(newBillForm);

        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
      });
    });

    // Test d'integration NewBill POST.

    describe("When I submit a new bill", () => {
      test("Then the newBill should be posted", async () => {
        const testBill = await mockStore.bills().test()
        const spy = jest.spyOn(mockStore, "bills");
        const response = await mockStore.bills().create(testBill);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(response.length).toBe(5);
        expect(response.pop().id).toBe(testBill.id);
      });
      
      describe("When the API call fails with a 404 error message", () => {
        test("Then a 404 error message should be displayed", async () => {
          const testBill = await mockStore.bills().test()
          mockStore.bills.mockImplementationOnce(() => {
            return {
              update: () => {
                return Promise.reject(new Error("Erreur 404"));
              },
            };
          });

          let response;
          try {
            response = await mockStore.bills().update(testBill);
          } catch (err) {
            response = err;
          }
          
          document.body.innerHTML = BillsUI({ error: response });
          const message = screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        });
      });
      
      describe("When the API call fails with a 500 error message", () => {
        test("Then a 500 error message should be displayed", async () => {
          const testBill = await mockStore.bills().test()
          mockStore.bills.mockImplementationOnce(() => {
            return {
              update: () => {
                return Promise.reject(new Error("Erreur 500"));
              },
            };
          });

          let response;
          try {
            response = await mockStore.bills().update(testBill);
          } catch (err) {
            response = err;
          }

          document.body.innerHTML = BillsUI({ error: response });
          const message = screen.getByText(/Erreur 500/);
          expect(message).toBeTruthy();
        });
      });
    });
  });
});




