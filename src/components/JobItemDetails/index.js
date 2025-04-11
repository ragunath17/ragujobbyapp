import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {IoMdStar} from 'react-icons/io'
import Header from '../Header'
import './index.css'

const jobItemApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemApiStatus: jobItemApiStatusConstants.initial,
    jobItemDetailsList: {},
    skillsDataList: [],
    lifeAtCompanyList: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    // const {searchIdInput} = this.state
    this.setState({jobItemApiStatus: jobItemApiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const jobsDetailsData = fetchedData.job_details

      const skillsData = fetchedData.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const {description} = fetchedData.job_details.life_at_company
      const imageUrl = fetchedData.job_details.life_at_company.image_url
      const lifeAtCompany = {description, imageUrl}

      const similarJobs = fetchedData.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobItemDetailsList: jobsDetailsData,
        jobItemApiStatus: jobItemApiStatusConstants.success,
        skillsDataList: skillsData,
        lifeAtCompanyList: lifeAtCompany,
        similarJobsList: similarJobs,
      })
    } else {
      this.setState({jobItemApiStatus: jobItemApiStatusConstants.failure})
    }
  }

  onClickJobItemRetryBtn = () => {
    this.setState({jobItemApiStatus: jobItemApiStatusConstants.inProgress})
    this.getJobItemDetails()
  }

  renderJobItemDetails = () => {
    const {jobItemDetailsList} = this.state
    const {
      title,
      location,
      rating,
      company_logo_url: companyLogoUrl,
      company_website_url: companyWebsiteUrl,
      employment_type: employmentType,
      package_per_annum: packagePerAnnum,
      job_description: jobDescription,
    } = jobItemDetailsList
    /*
    const {title, location, rating} = jobItemDetailsList
    const companyLogoUrl = jobItemDetailsList.company_logo_url
    const companyWebsiteUrl = jobItemDetailsList.company_website_url
    const employmentType = jobItemDetailsList.employment_type
    const packagePerAnnum = jobItemDetailsList.package_per_annum
    const jobDescription = jobItemDetailsList.job_description
    */

    return (
      <div>
        <div className="job-item-title-info-card">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-item-logo"
          />
          <div className="title-rating-card">
            <h1 className="job-item-title">{title}</h1>
            <div className="job-item-rating-card">
              <IoMdStar className="job-item-rating-icon" />
              <p className="job-item-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-location-type-card">
          <div className="job-item-location-card">
            <div className="job-item-info-card">
              <MdLocationOn className="job-item-info-icons" />
              <p className="job-item-info">{location}</p>
            </div>
            <div className="job-item-info-card">
              <BsFillBriefcaseFill className="job-item-info-icons" />
              <p className="job-item-info">{employmentType}</p>
            </div>
          </div>
          <p className="job-item-package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <div className="job-item-description-heading-card">
            <h1 className="job-item-description-heading">Description</h1>
            <a
              href={`${companyWebsiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="anchor"
            >
              Visit
              <BsBoxArrowUpRight className="arrow-icon" />
            </a>
          </div>
          <p className="job-item-description">{jobDescription}</p>
        </div>
      </div>
    )
  }

  renderSkillsList = () => {
    const {skillsDataList} = this.state
    return (
      <div>
        <h1 className="skills-heading">Skills</h1>
        <ul className="skills-container">
          {skillsDataList.map(eachSkill => (
            <li className="skills-list-items" key={eachSkill.name}>
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skills-logo"
              />
              <p className="skills-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {lifeAtCompanyList} = this.state
    const {description, imageUrl} = lifeAtCompanyList
    return (
      <div>
        <h1 className="life-at-company-heading">Life at Company</h1>
        <div className="life-at-company-container">
          <p className="life-at-company-description">{description}</p>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-at-company-img"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    console.log(similarJobsList)

    return (
      <div className="similar-jobs-container">
        <div className="similar-jobs-content-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <div className="similar-jobs-list-container">
            <ul className="similar-jobs-list-items-card">
              {similarJobsList.map(eachJob => (
                <li className="similar-jobs-list-items" key={eachJob.id}>
                  <div className="similar-jobs-logo-card">
                    <img
                      src={eachJob.companyLogoUrl}
                      alt="similar job company logo"
                      className="similar-jobs-logo"
                    />
                    <div>
                      <h1 className="similar-jobs-title">{eachJob.title}</h1>
                      <div className="job-item-rating-card">
                        <IoMdStar className="job-item-rating-icon" />
                        <p className="job-item-rating">{eachJob.rating}</p>
                      </div>
                    </div>
                  </div>
                  <h1 className="similar-jobs-description-heading">
                    Description
                  </h1>
                  <p className="similar-jobs-description">
                    {eachJob.jobDescription}
                  </p>
                  <div className="job-item-location-card">
                    <div className="job-item-info-card">
                      <MdLocationOn className="job-item-info-icons" />
                      <p className="job-item-info">{eachJob.location}</p>
                    </div>
                    <div className="job-item-info-card">
                      <BsFillBriefcaseFill className="job-item-info-icons" />
                      <p className="job-item-info">{eachJob.employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderJobItemSuccessView = () => (
    <div className="job-item-bg-container">
      <div className="job-item-details-container">
        {this.renderJobItemDetails()}
        {this.renderSkillsList()}
        {this.renderLifeAtCompany()}
      </div>
      <div>{this.renderSimilarJobs()}</div>
    </div>
  )

  renderJobItemFailureView = () => (
    <div className="job-item-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something went wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-item-failure-view-retry-btn"
        onClick={this.onClickJobItemRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemLoaderView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobItemView = () => {
    const {jobItemApiStatus} = this.state

    switch (jobItemApiStatus) {
      case jobItemApiStatusConstants.success:
        return this.renderJobItemSuccessView()
      case jobItemApiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case jobItemApiStatusConstants.inProgress:
        return this.renderJobItemLoaderView()
      default:
        return null
    }
  }

  render() {
    const {jobItemDetailsList} = this.state
    console.log(jobItemDetailsList)

    return (
      <div>
        <Header />
        {this.renderAllJobItemView()}
      </div>
    )
  }
}

export default JobItemDetails
