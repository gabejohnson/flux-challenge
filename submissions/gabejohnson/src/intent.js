import xs from 'xstream'

function intent(DOM) {
  return {
    scroll$: xs.merge(
      DOM.select('.scroll-up').events('click').map(() => +2),
      DOM.select('.scroll-down').events('click').map(() => -2)
    ).startWith(0)
  }
}

export default intent
