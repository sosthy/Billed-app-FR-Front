/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

$.fn.modal = jest.fn(); 
jest.mock("../app/store", () => mockStore)

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
      expect(windowIcon.classList).toContain('active-icon');
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe("When I click on eye button", () => {
    test("The handleClickIconEye are called", async () => {
      const billsController = new Bills({
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
      })

      document.body.innerHTML = BillsUI({ data: bills })

      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)[0]
      const handleClickIconEyeMock = jest.fn(() => billsController.handleClickIconEye(iconEye))

      iconEye.addEventListener('click', handleClickIconEyeMock)
      userEvent.click(iconEye)
      expect(handleClickIconEyeMock).toHaveBeenCalled()
    })
  })
  describe("When I click on new bill", () => {
    test("The handleClickNewBill are called", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsController = new Bills({
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
      })

      billsController.handleClickNewBill()
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe("When I click on getBills", () => {
    test("The getBills are called", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsController = new Bills({
        document, onNavigate, store: mockStore, bills: bills, localStorage: window.localStorage
      })

      const listBills = await billsController.getBills()
      expect(listBills).toBeTruthy()
    })
  })
  describe("When I click on getBills", () => {
    test("The getBills are called with Error", async () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const mockedBills = {
        bills() {
          return {
            list() {
              return Promise.resolve([{
                "id": "47qAXb6fIm2zOKkLzMro",
                "vat": "80",
                "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                "status": "pending",
                "type": "Hôtel et logement",
                "commentary": "séminaire billed",
                "name": "encore",
                "fileName": "preview-facture-free-201801-pdf-1.jpg",
                "date": "20040404",
                "amount": 400,
                "commentAdmin": "ok",
                "email": "a@a",
                "pct": 20
              }])
            }
          }
        }
      }

      const billsController = new Bills({
        document, onNavigate, store: mockedBills, bills: bills, localStorage: window.localStorage
      })

      const listBills = await billsController.getBills()
      expect(listBills).toBeTruthy()
    })
  })
})
