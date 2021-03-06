/* eslint-env jest */
// @flow
import R from 'ramda'

export const pickCallProps = (mockFn: JestMockFn, props: Array<string>): Array<Array<mixed>> =>
  R.map(
    R.map(
      R.pick(props)
    )
  )(mockFn.mock.calls)

export const expectDispatchedAction = (dispatchMock: JestMockFn, shape: Object) => {
  const dispatchedActions = pickCallProps(dispatchMock, R.keys(shape))
  expect(dispatchedActions).toContainEqual([shape])
}

export const mockDispatch = (fn: Function = R.identity) => jest.fn(fn)
