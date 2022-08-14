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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { getAuth, auth } from 'firebase/auth';
import { actionTypes } from './reducer';

function Sidebar() {
    const [{ user }, dispatch] = useStateValue();
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const auth = getAuth();
    const [searchChat, setSearchChat] = useState('');

    
    const handleLogout = () => {
        auth.signOut().then(() => {
            dispatch({
                type: actionTypes.RESET_USER,
                user: null,
            })
        })
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const fun = async () => {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        querySnapshot.forEach((doc) => {
            setRooms(old => [...old, { name: doc.data().name, id: doc.id }])
        });
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const menuCloseHandler = () => {
        setAnchorEl(null);
    }
    const changeSearchTextHandler = (event) => {
        const inputText = event.target.value
        setSearchChat(inputText);
        const filteredRooms = rooms.filter((room) => room.name.toLowerCase() === inputText.toLowerCase())
        setFilteredRooms(filteredRooms);
    }
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

                    <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={menuCloseHandler}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}>
                        <MenuItem onClick={handleLogout}> Logout  </MenuItem>
                        <MenuItem > Settings  </MenuItem>
                    </Menu>
                </div>
            </div>

            <div className='sidebar__search'>
                <div className='sidebar__searchContainer'>
                    <SearchOutlined />
                    <input placeholder='Search or start new chat' type="text" onChange={changeSearchTextHandler} value={searchChat} />
                </div>
            </div>
            <div className='sidebar__chats'>
                <SidebarChat addNewChat />
                {
                    searchChat ?
                        filteredRooms.map(room => (
                            <SidebarChat key={room.id} id={room.id} name={room.name} />
                        )) :
                        rooms.map(room => (
                            <SidebarChat key={room.id} id={room.id} name={room.name} />
                        ))
                }
            </div>
        </div>
    )
}

export default Sidebar;

