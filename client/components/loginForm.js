import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateLoginField, updatePasswordField, signIn } from '../redux/reducers/authentication'

const LoginForm = () => {
  const dispatch = useDispatch()
  const login = useSelector((store) => store.authentication.email)
  const password = useSelector((store) => store.authentication.password)

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center ">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
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
              className="bg-pink-700 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => dispatch(signIn())}
            >
              Sign In
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-pink-700 hover:text-blue-800"
              to="/registration"
            >
              REGESTRATION
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
