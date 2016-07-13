import xs from 'xstream'
import flattenConcurrently from 'xstream/extra/flattenConcurrently'
import dropRepeats from 'xstream/extra/dropRepeats'
import {thereIsAMatch} from './util'

const API_PATH = 'http://localhost:3000'
const DARTH_SIDIOUS_ID = 3616

function isSithInList(sith, list) {
  return list.findIndex(s => s !== null && s.id === sith.id) !== -1
}

function isSithMissingFromList(sith, list) {
  const first = list[0]
  const last = list[list.length - 1]
  const isMasterOfFirst = first !== null && first.master.id === sith.id
  const isApprenticeOfLast = last !== null && last.apprentice.id === sith.id
  return !isSithInList(sith, list) && !isMasterOfFirst && !isApprenticeOfLast
}

function missingSiths(state) {
  return xs.fromArray(state.list)
    .filter(sith => sith !== null)
    .map(sith => xs.of(sith.master, sith.apprentice))
    .compose(flattenConcurrently)
    .filter(sith =>
      sith.id !== null &&
      isSithMissingFromList(sith, state.list) &&
      !thereIsAMatch(state)
    )
}

function stateHash(state) {
  const matchedHash = String(state.list.findIndex(s => s !== null && s.matched))
  const listHash = state.list.map(s => s ? s.id : 'null').join('-')
  return listHash + matchedHash
}

export function request(state$) {
  return state$
    .compose(dropRepeats((x,y) => stateHash(x) === stateHash(y)))
    .map(missingSiths)
    .compose(flattenConcurrently)
    .map(sith => sith.url)
    .startWith(`${API_PATH}/dark-jedis/${DARTH_SIDIOUS_ID}`)
}

export function response(HTTPSource) {
  return HTTPSource.response$$
    .flatten()
    .filter(Boolean)
    .map(res => res.body)
    .remember()
}
