import io from 'socket.io-client'

  let socket = io.connect('http://localhost:4000')
    export default socket
  // console.log(socket);
//   socket.on('connect',function(){
//     console.log('与服务器建立起socket连接');
//   })