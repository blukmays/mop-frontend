import React from 'react'
import { expect } from 'chai'

import { mount } from 'enzyme'
import { unwrapReduxComponent } from '../lib'
import { createMockStore } from 'redux-test-utils'

import SearchBar from '../../src/containers/searchbar'


describe('<SearchBar />', () => {
  const baseStore = createMockStore({ userStore: {} })


  it('basic loading, short searchbar', () => {
    const context = mount(<SearchBar isLong={false} store={baseStore} />)
    const component = unwrapReduxComponent(context)
    expect(context.find('#search-box2').length).to.equal(1)
    expect(component.prop('query')).to.equal(undefined)
    expect(component.prop('isLong')).to.equal(false)
    expect(component.prop('selectState')).to.equal(undefined)
    expect(context.find('.form-vertical').length).to.equal(1)
  })

  it('basic loading, long searchbar', () => {
    const context = mount(<SearchBar isLong store={baseStore} />)
    const component = unwrapReduxComponent(context)
    expect(component.prop('query')).to.equal(undefined)
    expect(component.prop('isLong')).to.equal(true)
    expect(component.prop('selectState')).to.equal(undefined)
    expect(context.find('input[type="text"]').length).to.equal(1)
    expect(context.find('select').length).to.equal(1)
    expect(context.find('button[type="submit"]').length).to.equal(1)
  })

  it('prepopulates query if passed in', () => {
    const searchBarProps = { query: 'cats' }
    const context = mount(<SearchBar {...searchBarProps} store={baseStore} />)
    const component = unwrapReduxComponent(context)
    expect(component.prop('query')).to.equal('cats')
    expect(component.prop('selectState')).to.equal(undefined)
  })

  // TODO: did we intentionally not include state select when the search bar is long?
  it('prepopulates selectState if passed in ', () => {
    const searchBarProps = { selectState: 'VA' }
    const context = mount(<SearchBar {...searchBarProps} store={baseStore} />)
    const component = unwrapReduxComponent(context)
    expect(component.prop('query')).to.equal(undefined)
    expect(component.prop('selectState')).to.equal('VA')
  })
})
