import React from 'react'
import PropTypes from 'prop-types'

import StateSelect from './state-select'

const StateOrRegionInput = ({ country, stateOnChange, regionOnChange }) => {
  if (country === 'United States') {
    return (
      <StateSelect onChange={stateOnChange} selectText='State*' />
    )
  }
  return (
    <input
      type='text'
      name='region'
      placeholder='Region'
      className='region moveon-track-click'
      onChange={regionOnChange}
      onBlur={regionOnChange}
    />
  )
}

StateOrRegionInput.propTypes = {
  country: PropTypes.string,
  regionOnChange: PropTypes.func,
  stateOnChange: PropTypes.func
}

export default StateOrRegionInput
