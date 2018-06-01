import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { appLocation } from '../routes'

// import { submitPetition } from '../actions/createPetitionActions'

import { CreatePreview as CreatePreviewComponent } from 'LegacyTheme/create-preview'

class CreatePreview extends React.Component {
  constructor(props) {
    super(props)
    this.submitPetition = this.submitPetition.bind(this)
  }
  componentDidMount() {
    if (!this.props.hasPetition) appLocation.push('/create_start.html')
  }

  // eslint-disable-next-line
  submitPetition() {
    return null
    // this.props.dispatch(submitPetition())
  }

  render() {
    if (!this.props.hasPetition) return null // We will also redirect in componentDidMount
    return (
      <CreatePreviewComponent
        petition={this.props.petition}
        user={this.props.user}
        onSubmit={this.submitPetition}
      />
    )
  }
}

CreatePreview.propTypes = {
  hasPetition: PropTypes.bool,
  petition: PropTypes.object,
  user: PropTypes.object
  // dispatch: PropTypes.func
}

function mapStateToProps({ petitionCreateStore, userStore }) {
  return {
    hasPetition: !!(
      petitionCreateStore &&
      petitionCreateStore.title &&
      !petitionCreateStore.submitted
    ),
    petition: petitionCreateStore,
    user: userStore
  }
}

export default connect(mapStateToProps)(CreatePreview)
