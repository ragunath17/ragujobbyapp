import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {IoMdStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import Profile from '../Profile'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationList = ['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    jobDetails: [],
    employmentTypeInput: [],
    minimumPackageInput: '',
    locations: [],
  }

  componentDidMount = () => {
    this.getJobsInfo()
  }

  getJobsInfo = async () => {
    console.log('getjobsinfo called')
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {
      searchInput,
      employmentTypeInput,
      minimumPackageInput,
      locations,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')

    const employmentTypes = employmentTypeInput.join(',')
    const locationTypes = locations.join(',')

    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${minimumPackageInput}&location=${locationTypes}&search=${searchInput}`
    console.log(jobsUrl)
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsInfo()
    }
  }

  onClickSearchLogo = () => {
    this.getJobsInfo()
  }

  handleSalaryRange = event => {
    this.setState({minimumPackageInput: event.target.value}, this.getJobsInfo)
  }

  handleEmploymentType = employmentTypeId => {
    this.setState(prevState => {
      const {employmentTypeInput} = prevState
      if (employmentTypeInput.includes(employmentTypeId)) {
        return {
          employmentTypeInput: employmentTypeInput.filter(
            id => id !== employmentTypeId,
          ),
        }
      }
      return {employmentTypeInput: [...employmentTypeInput, employmentTypeId]}
    }, this.getJobsInfo)
  }
  /*
  handleLocationChange = location => {
    this.setState(prevState => {
      const {locations} = prevState
      if (locations.includes(location)) {
        return {
          locations: locations.filter(loc => loc !== location),
        }
      }
      return {locations: [...locations, location]}
    }, this.getJobsInfo)
  }
  */

  handleLocationChange = location => {
    this.setState(prevState => {
      const updatedLocation = prevState.locations.includes(location)
        ? prevState.locations.filter(loc => loc !== location)
        : [...prevState.locations, location]
      return {locations: updatedLocation}
    }, this.getJobsInfo)
  }

  onClickRetryBtn = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    this.getJobsInfo()
  }

  renderEmployeesTypeList = () => {
    const {employmentTypeInput} = this.state
    console.log(employmentTypeInput)

    return (
      <div className="employment-container">
        <h1 className="employment-heading">Type of Employment</h1>
        <ul className="unordered-props-list-container">
          {employmentTypesList.map(eachType => (
            <li className="props-list-items" key={eachType.employmentTypeId}>
              <label className="employment-label">
                <input
                  className="label-input"
                  type="checkbox"
                  value={eachType.employmentTypeId}
                  onChange={() =>
                    this.handleEmploymentType(eachType.employmentTypeId)
                  }
                  checked={employmentTypeInput.includes(
                    eachType.employmentTypeId,
                  )}
                />
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryRangeList = () => {
    const {minimumPackageInput} = this.state

    return (
      <div className="employment-container">
        <h1 className="employment-heading">Salary Range</h1>
        <ul className="unordered-props-list-container">
          {salaryRangesList.map(range => (
            <li className="props-list-items" key={range.salaryRangeId}>
              <label className="employment-label">
                <input
                  className="label-input"
                  type="radio"
                  onChange={this.handleSalaryRange}
                  value={range.salaryRangeId}
                  checked={minimumPackageInput === range.salaryRangeId}
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLocationList = () => {
    const {locations} = this.state
    console.log(locations)
    return (
      <div className="employment-container">
        <h1 className="employment-heading">Locations</h1>
        <ul className="unordered-props-list-container">
          {locationList.map(eachLocation => (
            <li className="props-list-items" key={eachLocation}>
              <label className="employment-label">
                <input
                  className="label-input"
                  type="checkbox"
                  value={eachLocation}
                  checked={locations.includes(eachLocation)}
                  onChange={() => this.handleLocationChange(eachLocation)}
                />
                {eachLocation}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetails} = this.state

    return (
      <div>
        <ul className="jobs-unordered-list-container">
          {jobDetails.map(job => (
            <li key={job.id} className="jobs-list-items">
              <div className="job-logo-container">
                <img
                  src={job.companyLogoUrl}
                  alt="company logo"
                  className="job-logo"
                />
                <div className="job-title-card">
                  <Link to={`/jobs/${job.id}`} className="job-link">
                    <h1 className="job-title">{job.title}</h1>
                  </Link>
                  <div className="rating-card">
                    <IoMdStar className="rating-icon" />
                    <p className="job-rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="jobs-more-info-card">
                <div className="location-and-type-card">
                  <div className="location-card">
                    <MdLocationOn className="jobs-more-info-icons" />
                    <p className="job-location">{job.location}</p>
                  </div>
                  <div className="location-card">
                    <BsFillBriefcaseFill className="jobs-more-info-icons" />
                    <p className="job-location">{job.employmentType}</p>
                  </div>
                </div>
                <p className="job-package">{job.packagePerAnnum}</p>
              </div>
              <hr className="line" />
              <div>
                <h1 className="description-heading">Description</h1>
                <p className="job-description">{job.jobDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderNoJobDetailsView = () => (
    <div className="no-jobs-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-view-img"
      />
      <h1 className="no-jobs-title">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something went wrong</h1>

      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-view-retry-btn"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus, jobDetails} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        if (jobDetails.length === 0) {
          return this.renderNoJobDetailsView()
        }
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoaderView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div>
        <Header />
        <div className="job-container">
          <div className="job-bg-container">
            <div className="search-input-container">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchLogo}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <Profile />
            <hr />
            <div>{this.renderEmployeesTypeList()}</div>
            <hr />
            <div>{this.renderSalaryRangeList()}</div>
            <hr />
            <div>{this.renderLocationList()}</div>
          </div>
          <div className="jobs-details-container">
            <div className="desktop-view-search-input-container">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchLogo}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderAllViews()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
