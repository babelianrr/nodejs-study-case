import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../context/userContext"
import { useHistory } from "react-router-dom"
import { useAlert } from "react-alert"
import { API } from "../../config/api"
const SITE_KEY = "6Ld29mIfAAAAAC6reHRzEWZIzK25ib-D2oH8t8h2"

export default function Login() {
  const alert = useAlert()
  let history = useHistory()

  const [state, dispatch] = useContext(UserContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id)

      if (!isScriptExist) {
        let script = document.createElement("script")
        script.type = "text/javascript"
        script.src = url
        script.id = id
        script.onload = () => {
          if (callback) callback()
        }
        document.body.appendChild(script)
      }

      if (isScriptExist && callback) callback()
    }

    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
      console.log("Script loaded!")
    })
  }, [])

  const handleOnClick = (e) => {
    e.preventDefault()
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: "submit" }).then(token => {
        handleSubmit(token)
      })
    })
  }

  const handleSubmit = async (token) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }
      const body = JSON.stringify({
        "email": email,
        "password": password,
        "g-recaptcha-response": token
      })
      const response = await API.post("/login", body, config)
      if (response?.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data
        })
        if (response.data.data.role_id === 1) {
          history.push("/admin")
        } else {
          history.push("/")
        }
      }
    } catch (error) {
      alert.error("Credentials does not match!")
      console.log(error)
    }
  }

  return (
    <div>
      <div className="container">
        <h1 className="mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <button className="form-control btn btn-primary" onClick={handleOnClick}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
