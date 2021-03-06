/* eslint-env jest */
import R from 'ramda'

import configureReducer from '~/src/reducer'

const defaultState = { default: 'state' }
const merger = (state, action) => R.merge(state, { data: action.data })

const actionData = { data: { actionData: 'action-data' } }
const action = R.merge(actionData, { type: 'action.type' })

describe('configureReducer', () => {
  const reducer = configureReducer(defaultState, merger, 'action.type')

  describe('when action does not match', () => {
    it('returns state if given', () => {
      const state = R.merge(defaultState, { data: { previous: 'data' } })
      const action = { type: 'different.action' }
      expect(reducer(state, action)).toEqual(state)
    })

    it('returns default state if no state is given', () => {
      const action = { type: 'different.action' }
      expect(reducer(null, action)).toEqual(defaultState)
    })
  })

  it('returns new state when action matches', () => {
    const state = R.merge(defaultState, { data: { previous: 'data' } })
    expect(reducer(state, action)).toEqual(R.merge(defaultState, actionData))
  })

  it('returns new state when action matches and state is null', () => {
    expect(reducer(null, action)).toEqual(R.merge(defaultState, actionData))
  })

  it('prevents accidentally returning a function from a merger', () => {
    const reducer = configureReducer(defaultState, 'action.type', (state, action) => R.merge(state))
    expect(() => { reducer(null, action) }).toThrow()
  })
})
