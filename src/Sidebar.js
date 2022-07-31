import React, { useEffect, useState } from 'react';
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import './Sidebar.css';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from "./SidebarChat";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import db from "./firebase";
import { useStateValue } from './StateProvider';

function Sidebar() {
    const [{ user }, dispatch] = useStateValue();
    const [rooms, setRooms] = useState([]);

    const fun = async () => {
        console.log("Hello ")
        const querySnapshot = await getDocs(collection(db, "rooms"));

        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setRooms(old => [...old, { name: doc.data().name, id: doc.id }])
        });
    }
    // console.log(rooms);
    // console.log(user)

    useEffect(() => {
        fun()
        return () => {
            fun();
        }
    }, [])

    return (

        <div className='sidebar'>
            <div className='sidebar__header'>
                <Avatar src={user?.photoURL} />
                <div className='.sidebar__headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>

            </div>

            <div className='sidebar__search'>
                <div className='sidebar__searchContainer'>
                    <SearchOutlined />
                    <input placeholder='Search or start new chat' type="text" />
                </div>
            </div>

            <div className='sidebar__chats'>
                <SidebarChat addNewChat />
                {
                    rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.name} />
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar;

