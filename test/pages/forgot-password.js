import React from 'react'
import nock from 'nock'
import { expect } from 'chai'
import { mount } from 'enzyme'

import Config from '../../src/config'
import ForgotPassword from '../../src/containers/forgot-password'
import ForgotPasswordForm from 'LegacyTheme/forgot-password-form'

const BASE_URI = 'http://localhost:8080'
Config.API_URI = BASE_URI

describe('<ForgotPassword />', () => {
  it('renders the forgot password form', () => {
    const component = mount(<ForgotPassword />)
    expect(component.find(ForgotPasswordForm)).to.have.length(1)
    expect(component.find('input[name="email"]').length).to.equal(1)
  })

  it('displays errors when required fields are missing', () => {
    const login = mount(<ForgotPassword />)
    login.find('form').simulate('submit')
    expect(login.find('.errors').text()).to.equal(
      'Missing required entry for the Email field.'
    )
  })

  it('validates email', () => {
    const login = mount(<ForgotPassword />)
    login.find('input[name="email"]').instance().value = 'foo'
    login.find('form').simulate('submit')
    expect(login.find('.errors').text()).to.equal(
      'Invalid entry for the Email field.'
    )
  })

  it('sends a request on submit', () => {
    const api = nock(BASE_URI)
      .post('/users/forgot-password.json', { email: 'foo@example.com' })
      .reply(200)

    const login = mount(<ForgotPassword />)
    login.find('input[name="email"]').instance().value = 'foo@example.com'
    login.find('form').simulate('submit')
    expect(api.pendingMocks().length).to.equal(0)
  })
})
