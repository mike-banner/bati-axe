import WebSocket from 'ws'

export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === 'undefined') {
    // @ts-ignore
    globalThis.WebSocket = WebSocket
  }
})
