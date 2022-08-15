import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AttachFile, InsertEmoticon, Message, MicOutlined, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import "./Chat.css";
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, orderBy, query, Timestamp,  addDoc } from "firebase/firestore";
import db from "./firebase";
import { useStateValue } from './StateProvider';

function Chat() {

  const [seed, setSeed] = useState('');
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [chat, setChat] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [search, setSearch] = useState('');
  const [refreshInterval, setrefreshInterval] = useState();

  const retrieveChat = async () => {
    
    const decRef = doc(db, 'rooms', roomId);
    const docSnap = await getDoc(decRef);
    if (docSnap.exists()) {
      setRoomName(docSnap.data().name)
    } else {
      console.log("No data")
    }
    const querySnap = query(collection(db, "rooms", roomId, 'messages'), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(querySnap);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      arr.push(data);
    });
    setChat(arr);
  }

  // useEffect(() => {
  //   setSeed(Math.floor(Math.random() * 5000));
  //   if (refreshInterval) {
  //     clearInterval(refreshInterval);
  //     setrefreshInterval(null)
  //   }
  //   if (roomId) {
  //     const refreshInt = setInterval(retrieveChat, 10000);
  //     setrefreshInterval(refreshInt)
  //   }
  // }, []);
  useEffect(() => {
    if (roomId) {      
      retrieveChat()
    }
  }, [roomId, search]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const docData = {
      messages: input,
      name: user?.displayName,
      timestamp: Timestamp.fromDate(new Date())
    }
    await addDoc(collection(db, "rooms", roomId, "messages"), docData);
    setInput("");
    retrieveChat();
  }

  const searchChatHandler = (event) => {

    let searchRoom = prompt("Please enter room name ");
    if (searchRoom) {
      setSearch(searchRoom);
    }

  }


  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className='chat__headerInfo'>
          {
            roomName && (
              <React.Fragment>
                <h3> {roomName} </h3>
                <p>Last seen at ...{new Date(chat[chat.length - 1]?.timestamp?.toDate()).toUTCString()} </p>
              </React.Fragment>
            )
          }
        </div>
        <div className='chat__headerRight'>
          <IconButton >
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className='chat__body'>
        {
          chat.map((item, index) => (
            <p key={index} className={`chat__message ${item.name === user?.displayName && 'chat__receiver'}`}>
              <span className='chat__name'>{item.name}</span>
              {item.messages}
              <span className='chat__timeStamp'>{
                new Date(item.timestamp?.toDate()).toUTCString()
              }</span>
            </p>
          ))
        }
      </div>

      <div className='chat__footer'>
        <InsertEmoticon />
        <form>
          <input type="text" placeholder='Type a message' value={input} onChange={(e) => setInput(e.target.value)} />
          <button type='submit' onClick={sendMessage}> Send a message</button>
        </form>
        <MicOutlined />
      </div>
    </div>
  )
}


export default Chat;
