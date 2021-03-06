/* eslint-env jest */

import lifecycleAction from '~/src/network/lifecycle-action'

describe('lifecycleAction', () => {
  const actionCreator = lifecycleAction('action.type', 'request', true)

  it('merges data correctly', () => {
    const action = actionCreator({ data: { some: 'data' } })
    expect(action).toMatchObject({
      type: 'action.type.request',
      isFetching: true,
      data: {
        some: 'data'
      }
    })
  })

  it('includes data but not error when passed that way', () => {
    const error = new Error({ some: 'data' })
    const action = actionCreator({ error })
    expect(action).toMatchObject({
      type: 'action.type.request',
      isFetching: true,
      error
    })
  })

  it('does not include data/error if not passed', () => {
    const action = actionCreator()
    expect(action.data).toBeUndefined()
    expect(action.error).toBeUndefined()
  })
})
