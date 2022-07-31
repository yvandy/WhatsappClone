import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import './SidebarChat.css';
import db from "./firebase";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, orderBy, onSnapshot, query, Timestamp, setDoc, addDoc, listCollections } from "firebase/firestore";


function SidebarChat({ id, name, addNewChat }) {
    
    const [seed, setSeed] = useState('');
    let arr = [];
    const [chat, setChat] = useState([]);

    const retriveLastMessage = async () =>{
        const querySnap = query(collection(db, "rooms", id, 'messages'), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(querySnap);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            arr.push(data);
            setChat(arr);
        });
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
        console.log(id)
        if (id) {
            retriveLastMessage();
            console.log(chat)
        }
    }, [id])

    

    const createChat = async () => {
        const roomName = prompt("Please enter name for chat ");
        if (roomName) {
            const docRef = await addDoc(collection(db, 'rooms'), {
                name: roomName
            });
            console.log("Document written with id: ", docRef.id)
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className='sidebarChat'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className='sidebarChat__info'>
                    <h2> {name} </h2>
                    <p> {chat[0]?.messages} </p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2> Add New Chat</h2>
        </div>
    )
}

export default SidebarChat;