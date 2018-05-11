import React from 'react'
import { Provider } from 'react-redux'
import { expect } from 'chai'

import { mount } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

import Login from '../../src/containers/login'
import LoginForm from 'LegacyTheme/login-form'

const empty = createMockStore({ userStore: {} })

describe('<Login />', () => {
  const baseStore = createMockStore({ userStore: {} })
  it('renders the login form', () => {
    const myComponent = <Login params={{}} />
    const context = mount(<Provider store={baseStore} children={myComponent} />)
    expect(context.find(LoginForm)).to.have.length(1)
  })

  it('displays errors when required fields are missing', () => {
    const login = mount(<Provider store={empty} children={<Login />} />)
    login.find('form').simulate('submit')
    expect(login.find('.errors').find('li').length).to.equal(2)
  })

  it('validates email', () => {
    const login = mount(<Provider store={empty} children={<Login />} />)
    login.find('input[name="email"]').instance().value = 'foo'
    login.find('input[name="password"]').instance().value = 'bar'
    login.find('form').simulate('submit')
    expect(login.find('.errors').text()).to.equal(
      'Invalid entry for the Email field.'
    )
  })
})
