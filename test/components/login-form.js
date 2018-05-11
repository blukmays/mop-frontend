import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'

import { mount, shallow } from 'enzyme'

import LoginForm from 'LegacyTheme/login-form'

describe('<LoginForm />', () => {
  it('displays fields', () => {
    const login = shallow(<LoginForm />)
    expect(login.find('input[name="email"]').length).to.equal(1)
    expect(login.find('input[name="password"]').length).to.equal(1)
  })

  it('passed errors are displayed', () => {
    const errorList = () => [<li key={1}>There was a login error</li>]
    const login = shallow(<LoginForm errorList={errorList} />)
    expect(login.find('.errors').text()).to.equal('There was a login error')
  })

  it('submitting valid data calls submit function', () => {
    const spy = sinon.spy()
    const login = mount(<LoginForm handleSubmit={spy} />)
    login.find('input[name="email"]').instance().value = 'foo@example.com'
    login.find('input[name="password"]').instance().value = 'bar'
    login.find('form').simulate('submit')
    expect(spy.calledOnce).to.be.true
  })
})
