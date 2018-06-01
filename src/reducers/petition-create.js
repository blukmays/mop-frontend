import { actionTypes } from '../actions/createPetitionActions'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_PETITION_PREVIEW_SUBMIT:
      // You have to submit all values in the action together
      return {
        submitted: false,
        title: action.title,
        summary: action.summary,
        description: action.description,
        target: action.target
      }
    case actionTypes.CREATE_PETITION_SUCCESS:
      return {
        submitted: true,
        petition: action.petition
      }
    default:
      return state
  }
}

export default reducer
