import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const profileApiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {profileData: {}, profileApiStatus: profileApiStatusConst.initial}

  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: profileApiStatusConst.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.profile_details
      this.setState({
        profileData: updatedData,
        profileApiStatus: profileApiStatusConst.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConst.failure})
    }
  }

  onClickProfileRetryBtn = () => {
    this.setState({profileApiStatus: profileApiStatusConst.inProgress})
    this.getProfileData()
  }

  renderProfileData = () => {
    const {profileData} = this.state
    const {name} = profileData
    const profileImageUrl = profileData.profile_image_url
    const shortBio = profileData.short_bio

    return (
      <div className="profile-container">
        <div className="profile-bg-container">
          <img
            src={profileImageUrl}
            alt="profile"
            className="profile-img"
            key={name}
          />
          <div>
            <h1 className="profile-name">{name}</h1>
            <p className="profile-bio">{shortBio}</p>
          </div>
        </div>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="retry-btn-card">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConst.success:
        return this.renderProfileData()
      case profileApiStatusConst.failure:
        return this.renderProfileFailure()
      case profileApiStatusConst.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default Profile
