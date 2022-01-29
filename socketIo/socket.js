import io from 'socket.io-client'
let socket = io.connect('http://192.168.123.127:3000')
export default socket