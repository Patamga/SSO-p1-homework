import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateLoginField,
  updatePasswordField,
  updateUsernameField,
  create
} from '../redux/reducers/registration'

const RegistrationForm = () => {
  const dispatch = useDispatch()
  const login = useSelector((s) => s.registration.login)
  const password = useSelector((s) => s.registration.password)
  const name = useSelector((s) => s.registration.name)
  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center ">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => {
                dispatch(updateUsernameField(e.target.value))
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="e-mail"
              value={login}
              onChange={(e) => {
                dispatch(updateLoginField(e.target.value))
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => {
                dispatch(updatePasswordField(e.target.value))
              }}
            />
            {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-pink-700 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => dispatch(create())}
            >
              Create Account
            </button>
            {/* <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a> */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
