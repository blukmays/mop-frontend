import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { appLocation } from '../routes'
import Thanks from './thanks'

class CreateFinished extends React.Component {
  componentDidMount() {
    if (!this.props.hasSubmittedPetition) appLocation.push('/create_start.html')
  }

  render() {
    if (!this.props.hasSubmittedPetition) return null // We will also redirect in componentDidMount
    return (
      <div className='moveon-petitions share container background-moveon-white bump-top-1'>
        <Thanks isCreator petition={this.props.petition} />
      </div>
    )
  }
}

function mapStateToProps({ petitionCreateStore }) {
  return {
    hasSubmittedPetition: !!(petitionCreateStore && petitionCreateStore.submitted),
    petition: petitionCreateStore.petition
  }
}

CreateFinished.propTypes = {
  hasSubmittedPetition: PropTypes.bool,
  petition: PropTypes.object
}

export default connect(mapStateToProps)(CreateFinished)
