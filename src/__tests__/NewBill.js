/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then file upload with correct type sucessfully", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const newBillController = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const fileInput = screen.getByTestId("file");
      const file = new File(['fake_photo_path'], 'fake_photo_path.png', { type: 'image/png' })
      const handleChange = jest.fn(newBillController.handleChangeFile);
      fileInput.addEventListener('change', handleChange)
      userEvent.upload(fileInput, file)
      expect(handleChange).toHaveBeenCalled()
    })
    test("Then file upload with incorrect type", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const newBillController = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const fileInput = screen.getByTestId("file");
      const file = new File(['fake_photo_path'], 'fake_photo_path.pdf', { type: 'application/pdf' })

      const handleChange = jest.fn(newBillController.handleChangeFile);
      fileInput.addEventListener('change', handleChange)
      userEvent.upload(fileInput, file)
    })
    test("Then file upload with error", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      jest.spyOn(mockStore, "bills")
      
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      mockStore.bills.mockImplementationOnce(() => {
        return { create : () =>  Promise.reject(new Error("Erreur 500")) }})

      const newBillController = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const fileInput = screen.getByTestId("file");
      const file = new File(['fake_photo_path'], 'fake_photo_path.png', { type: 'image/png' })

      const handleChange = jest.fn(newBillController.handleChangeFile);
      
      fileInput.addEventListener('change', handleChange)
      userEvent.upload(fileInput, file)
    })
  })
})
describe("Given I am connected as an admin", () => {
  describe("When I am on NewBill Page", () => {
    test("Then file upload with correct type sucessfully", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin',
      }))

      const newBillController = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const expenseTypeInput = screen.getByTestId("expense-type");
      fireEvent.change(expenseTypeInput, { target: { value: "pasunemail" } });

      const datepickerInput = screen.getByTestId("datepicker");
      fireEvent.change(datepickerInput, { target: { value: "pasunemail" } });

      const amountInput = screen.getByTestId("amount");
      fireEvent.change(amountInput, { target: { value: "pasunemail" } });

      const pctInput = screen.getByTestId("pct");
      fireEvent.change(pctInput, { target: { value: "pasunemail" } });

      const fileInput = screen.getByTestId("file");
      const file = new File(['fake_photo_path'], 'fake_photo_path.png', { type: 'image/png' })
      userEvent.upload(fileInput, file)

      const handleSubmit = jest.fn(newBillController.handleSubmit);

      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
