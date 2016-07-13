import xs from 'xstream'

function makeWSDriver(url) {
  return function WSDriver() {
    let connection;
    return xs.create({
      start: listener => {
        console.log('starting WS driver')
        connection = new WebSocket(url)
        connection.onerror = err => listener.error(err)
        connection.onmessage = msg => listener.next(msg)
      },
      stop: () => connection.close()
    })
  }
}

export {makeWSDriver}
