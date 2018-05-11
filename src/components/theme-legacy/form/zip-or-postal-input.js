import React from 'react'
import PropTypes from 'prop-types'

const ZipOrPostalInput = ({ country, zipOnChange, postalOnChange }) => {
  if (country === 'United States') {
    return (
      <input
        type='text'
        name='zip'
        placeholder='ZIP Code*'
        className='zip moveon-track-click'
        onChange={zipOnChange}
        onBlur={zipOnChange}
      />
    )
  }
  return (
    <input
      type='text'
      name='postal'
      placeholder='Postal'
      className='postal moveon-track-click'
      onChange={postalOnChange}
      onBlur={postalOnChange}
    />
  )
}

ZipOrPostalInput.propTypes = {
  country: PropTypes.string,
  postalOnChange: PropTypes.func,
  zipOnChange: PropTypes.func
}

export default ZipOrPostalInput
