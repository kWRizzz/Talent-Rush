import{
    io
} from "socket.io-client"

io("http://localhost:3000",{
    withCredentials:true
})
