/* eslint-env jest */

import lifecycleAction from '~/src/crud/lifecycle-action'
import requestAction from '~/src/crud/request-action'
import { expectDispatchedAction } from '~/test/__helpers__/redux'

const dispatch = jest.fn()
const actionType = 'actiontype'
const lifecycleActions = {
  request: jest.fn(lifecycleAction(actionType, 'request', true)),
  success: jest.fn(lifecycleAction(actionType, 'success', false)),
  failure: jest.fn(lifecycleAction(actionType, 'failure', false))
}

describe('requestAction', () => {
  const handler = (getBody, getState) => Promise.resolve()
  const actionCreator = requestAction(actionType, handler, lifecycleActions)()
  const getState = () => ({
    [actionType]: {
      isFetching: false,
      timestamp: Date.now(),
      data: null,
      error: null
    }
  })

  it('always dispatches the start-request handler', () => {
    actionCreator(dispatch, getState)
    expect(lifecycleActions.request).toHaveBeenCalled()
    expectDispatchedAction(dispatch, { isFetching: true })
  })

  describe('when the request succeeds', () => {
    const responseData = { firstName: 'Jonas' }
    const handler = (getBody, getState) => Promise.resolve(responseData)
    const actionCreator = requestAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      actionCreator(dispatch, getState)
      .then(() => {
        expect(lifecycleActions.success).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, data: responseData })
      })
    })
  })

  describe('when the request fails', () => {
    const error = new Error({ some: 'error' })
    const handler = (getBody, getState) => Promise.reject(error)
    const actionCreator = requestAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      actionCreator(dispatch, getState)
      .then(() => {
        expect(lifecycleActions.failure).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, error: error })
      })
    })
  })
})