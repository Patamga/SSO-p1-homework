import Cookies from 'universal-cookie'
import { history } from '..'

const CREATE_LOGIN = 'CREATE_LOGIN'
const CREATE_PASSWORD = 'CREATE_PASSWORD'
const CREATE_USER_NAME = 'CREATE_USER_NAME'
const LOGIN = 'LOGIN'

const cookies = new Cookies()
const initialState = {
  email: '',
  username: '',
  password: '',
  token: cookies.get('token'),
  user: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_NAME: {
      return { ...state, username: action.username }
    }
    case CREATE_LOGIN: {
      return { ...state, email: action.email }
    }
    case CREATE_PASSWORD: {
      return { ...state, password: action.password }
    }
    case LOGIN: {
      return { ...state, token: action.token, password: '', user: action.user }
    }
    default:
      return state
  }
}

export function updateLoginField(email) {
  return { type: CREATE_LOGIN, email }
}

export function updateUsernameField(username) {
  return { type: CREATE_USER_NAME, username }
}

export function updatePasswordField(password) {
  return { type: CREATE_PASSWORD, password }
}

// export function trySignIn() {
//   return (dispatch) => {
//     fetch('/api/v1/auth')
//       .then((res) => res.json())
//       .then((data) => {
//         dispatch({ type: LOGIN, token: data.token, user: data.user })
//         history.push('/private')
//       })
//   }
// }


export function create() {
  return (dispatch, getState) => {
    const { email, password, username } = getState().registration

    fetch('/api/v1/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
    })
      .then((res) => {
        console.log(res.ok, res)
        if (!res.ok) throw res
        return res.json()
      })
      .then((data) => {
        dispatch({ type: LOGIN, token: data.token, user: data.user })
        history.push('/private')
      })
      .catch((error) => {
        console.log(error)
        alert('Error: User already exists')
      })
  }
}
