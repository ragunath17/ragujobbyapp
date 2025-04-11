import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const handleLogoClick = () => {
    const {history} = props
    history.push('/')
  }

  return (
    <div className="header-bg-container">
      <Link to="/">
        <button
          type="button"
          className="heading-logo-btn"
          onClick={handleLogoClick}
        >
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="heading-logo"
          />
        </button>
      </Link>
      <ul className="unordered-list-items">
        <Link to="/" className="link-item">
          <AiFillHome className="icon" />
          <li className="desktop-view">Home</li>
        </Link>
        <Link to="/jobs" className="link-item">
          <BsFillBriefcaseFill className="icon" />
          <li className="desktop-view">Jobs</li>
        </Link>
        <li>
          <button
            type="button"
            className="logout-icon icon"
            onClick={onClickLogout}
          >
            <FiLogOut className="icon" />
          </button>
        </li>
      </ul>
      <button
        type="button"
        className="desktop-view logout-btn"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
