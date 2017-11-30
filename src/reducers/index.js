import { combineReducers } from 'redux'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions.js'
import { actionTypes as sessionActionTypes } from '../actions/sessionActions.js'

// function fetchPetitionRequest(petitionSlug) {
//     return {
//         type: FETCH_PETTION_REQUEST,
//         petitionSlug
//     }
// }

const initialPetitionState = {
  petitions: {}, // keyed by slug AND petition_id for petition route
  petitionSignatures: {}, // keyed by petition slug, then page
  signatureStatus: {}, // keyed by petition_id (because form doesn't have slug)
  signatureMessages: {}, // keyed by petition_id, MessageId value from SQS post
  topPetitions: {} // lists of petition IDs keyed by pac then megapartner
}

const initialUserState = {
  // Possible keys. none of these are guaranteed to be present/available
  // anonymous: <boolean>
  // given_name: (first name)
  // full_name:
  // emailHash: <the hash of the email address>
  // email:
  // zip:
  // state:
  // country:
  // signonId: (unique id from signon)
  // token: (either an id:<signon token> or akid:<akid token>) that can be used for a single action
  // identifiers: <probably a combination of signonId, token, and any other identifiers available>
}

function petitionReducer(state = initialPetitionState, action) {
  const { type, petition: petitionWithoutSlug, slug, page, signatures } = action
  let petition = {}
  if (typeof petitionWithoutSlug === 'object') {
    petition = Object.assign(petitionWithoutSlug, { slug })
  } else if (slug && typeof state.petitions[slug] !== 'undefined') {
    petition = state.petitions[slug]
  }
  switch (type) {
    case petitionActionTypes.FETCH_PETITION_SUCCESS:
      return Object.assign({}, state, {
        petitions: Object.assign(
          {}, state.petitions, {
            // key it both by id and by slug, for different lookup needs
            [slug]: petition,
            [petition.petition_id]: petition
          }
        )
      })
    case petitionActionTypes.PETITION_SIGNATURE_SUCCESS:
      const updateData = {
        'signatureStatus': Object.assign(
          {}, state.signatureStatus, { [petition.petition_id]: 'success' })
      }
      if (action.messageId) {
        updateData['signatureMessages'] = Object.assign(
          {}, state.signatureMessages, { [petition.petition_id]: action.messageId })
      }
      return Object.assign({}, state, updateData)
    case petitionActionTypes.FETCH_PETITION_SIGNATURES_SUCCESS:
      petition.signatureCount = signatures.count
      // TODO: get signatureGoal from API
      petition.signatureGoal = 1000000
      return Object.assign({}, state, {
        petitionSignatures: Object.assign(
          {}, state.petitionSignatures, {
            [slug]: Object.assign(
              {}, state.petitionSignatures[slug],
              {
                // eslint-disable-next-line no-underscore-dangle
                [page]: signatures._embedded.map((signature) =>
                  // eslint-disable-next-line no-underscore-dangle
                  Object.assign(signature, { user: signature._embedded.user })
                )
              }
            )
          }
        ),
        petitions: Object.assign(
          {}, state.petitions, {
            [slug]: petition,
            [petition.petition_id]: petition
          }
        )
      })
    case petitionActionTypes.FETCH_TOP_PETITIONS_SUCCESS:
      const {petitions, pac, megapartner} = action
      return Object.assign({}, state, {
        petitions: petitions.reduce((addedPetitions, petition) => {
          addedPetitions[petition.name] = petition
          addedPetitions[petition.petition_id] = petition
          return addedPetitions
        }, state.petitions),
        topPetitions: Object.assign({}, state.topPetitions, {
          [pac]: Object.assign({}, state.topPetitions[pac], {
            [megapartner]: petitions.map(petition => petition.petition_id)
          })
        })
      })
    default:
      return state
  }
}

function userReducer(state = initialUserState, action) {
  // fold in tokens at the top, since it's possible it's for everyone
  const newData = Object.assign({}, action.tokens || {})
  switch (action.type) {
    case sessionActionTypes.ANONYMOUS_SESSION_START:
      newData.anonymous = true
      return Object.assign({}, state, newData)
      break;
    // NOTE: the next 4 cases depend on switch-case fall-through
    // there are no breaks purposefully
    case sessionActionTypes.USER_SESSION_START:
    case sessionActionTypes.TOKEN_SESSION_START:
      if (action.session) {
        // this should cover any of: given_name, last_name, full_name, etc
        Object.assign(newData, action.session)
        const { identifiers } = action.session
        if (identifiers && identifiers.length) {
          newData.signonId = identifiers[0]
          identifiers.forEach((id) => {
            if (/^(ak|token)?id:/.test(id)) {
              newData.token = id
            }
          })
        }
      }
    // no break here: fall through to the failures
    case sessionActionTypes.USER_SESSION_FAILURE:
    case sessionActionTypes.TOKEN_SESSION_FAILURE:
      return Object.assign({}, state, newData)
      break;
    case petitionActionTypes.PETITION_SIGNATURE_SUBMIT:
      // if it's an anonymous user or we get useful session information
      // then copy it into userData
      if (!state.full_name
          && action.signature && action.signature.person) {
        if (action.signature.person.full_name) {
          newData.full_name = action.signature.person.full_name
        }
        if (action.signature.person.email_addresses
            && action.signature.person.email_addresses.length) {
          newData.email = action.signature.person.email_addresses[0]
          // TODO: possibly generate an md5hash here
        }
        if (action.signature.person.postal_addresses
            && action.signature.person.postal_addresses.length) {
          const address = action.signature.person.postal_addresses[0]
          newData.zip = address.postal_code
          newData.state = address.region
          newData.country = address.country_name
        }
        return Object.assign({}, state, newData)
      } else {
        return state
      }
      break;
    default:
      return state
  }
}

const rootReducer = combineReducers({
  petitionStore: petitionReducer,
  userStore: userReducer
})

export default rootReducer
