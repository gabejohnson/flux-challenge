import run from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {makeWSDriver} from './drivers'
import {response, request} from './http'
import intent from './intent'
import model from './model'
import view from './view'

function main(sources) {
  const planet$ = sources.WS.map(msg => JSON.parse(msg.data)).remember()
  const response$ = response(sources.HTTP)
  const actions = intent(sources.DOM)
  const state$ = model(planet$, response$, actions)
  const vtree$ = view(state$)
  const request$ = request(state$)

  return {
    HTTP: request$,
    DOM: vtree$
  }
}

const drivers = {
  DOM: makeDOMDriver('.app-container'),
  HTTP: makeHTTPDriver(),
  WS: makeWSDriver('ws://localhost:4000'),
}

run(main, drivers)
