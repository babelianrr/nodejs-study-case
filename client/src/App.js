import { useContext, useEffect } from "react"
import { Switch, Route, useHistory } from "react-router-dom"
import { UserContext } from "./context/userContext"

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import './index.css'

import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Admin from "./pages/Admin"
import { API, setAuthToken } from "./config/api"

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  let history = useHistory()
  const [state, dispatch] = useContext(UserContext)
  console.clear()
  console.log(state)
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    if (!state.isLogin) {
      history.push("/auth")
    } else {
      if (state.user.role_id === 1) {
        history.push("/admin")
      } else if (state.user.role_id === 2) {
        history.push("/")
      }
    }
  }, [state])

  const checkUser = async () => {
    try {
      const response = await API.get("/checkauth")

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        })
      }

      let payload = response.data.data.user

      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin" component={Admin} />
    </Switch>
  )
}

export default App
