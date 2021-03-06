import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { appLocation } from '../routes'
import { previewSubmit } from '../actions/createPetitionActions'

import CreatePetitionForm from 'LegacyTheme/create-petition-form'

const ERRORS = {
  name: 'Please provide a title for your petition.',
  text_statement: 'Please fill in the statement for your petition.',
  target: 'You must select at least one target for your petition.',
  text_about: 'Please provide background info for your petition.'
}

export class CreatePetition extends React.Component {
  constructor(props) {
    super(props)
    const { initialPetition } = this.props
    this.state = {
      selected: 'title',
      errors: [],
      title: initialPetition.title || '',
      summary: initialPetition.summary || '',
      target: initialPetition.target || [],
      description: initialPetition.description || ''
    }
    this.setSelected = this.setSelected.bind(this)
    this.setRef = this.setRef.bind(this)
    this.onPreview = this.onPreview.bind(this)
    this.onTargetAdd = this.onTargetAdd.bind(this)
    this.onTargetRemove = this.onTargetRemove.bind(this)
  }

  onPreview(event) {
    event.preventDefault()
    if (this.formIsValid()) {
      this.props.dispatch(
        previewSubmit({
          title: this.state.title,
          summary: this.state.summary,
          target: this.state.target,
          description: this.state.description
        })
      )
      appLocation.push('/create_preview.html')
    }
  }

  onTargetAdd(target, { isCustom } = { isCustom: false }) {
    if (!isCustom && !target.label) return // target is invalid
    if (!isCustom && this.state.target.find(old => old.label === target.label)) return // already exists

    this.setState(state => ({ target: [...state.target, target] }))
  }

  onTargetRemove(target) {
    this.setState(state => ({
      target: state.target.filter(e => e.label !== target.label)
    }))
  }

  setSelected(name) {
    return () => this.setState({ selected: name })
  }

  // We need refs because we call getClientRect to get the position
  // on the page to display the instructions next to it.
  setRef(name) {
    // eslint-disable-next-line no-return-assign
    return input => input && (this[name] = input)
  }

  formIsValid() {
    const { title, summary, target, description } = this.state
    const errors = []
    if (!title) errors.push(ERRORS.name)
    if (!summary) errors.push(ERRORS.text_statement)
    if (!target.length) errors.push(ERRORS.target)
    if (!description) errors.push(ERRORS.text_about)
    if (errors.length) {
      this.setState({ errors })
      return false
    }

    return true
  }

  render() {
    const elementByField = {
      title: this.titleInput,
      statement: this.statementInput,
      'target-national': this.nationalInput,
      'target-state': this.stateInput,
      'target-custom': this.customInput,
      about: this.aboutInput
    }

    const instructionStyle = { position: 'relative', top: -45 }
    const selectedElement = elementByField[this.state.selected]
    const bodyTop = document.body.getBoundingClientRect().top + 175

    if (typeof selectedElement !== 'undefined') {
      instructionStyle.top =
        selectedElement.getBoundingClientRect().top - bodyTop
    }

    return (
      <div className='moveon-petitions'>
        <CreatePetitionForm
          setSelected={this.setSelected}
          setRef={this.setRef}
          selected={this.state.selected}
          instructionStyle={instructionStyle}
          errors={this.state.errors}
          onChange={({ target: { name, value } }) => this.setState({ [name]: value })}
          onPreview={this.onPreview}
          title={this.state.title}
          summary={this.state.summary}
          description={this.state.description}
          targets={this.state.target}
          onTargetAdd={this.onTargetAdd}
          onTargetRemove={this.onTargetRemove}
        />
      </div>
    )
  }
}

CreatePetition.defaultProps = {
  initialPetition: {}
}

CreatePetition.propTypes = {
  dispatch: PropTypes.func,
  initialPetition: PropTypes.object
}

export default connect()(CreatePetition)
