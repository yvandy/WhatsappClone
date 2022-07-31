import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import logo from './whatsapp_img.png';
import { authProvider } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';

function Login() {

    const [{ }, dispatch] = useStateValue();
    
    const auth = getAuth();
    const signIn = () => {
        // console.log(auth, authProvider);
        signInWithPopup(auth, authProvider)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // console.log(credential, result);
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                })
            }).catch((error) =>
                console.log(error.message)
            )
    }

    return (
        <div className='login'>
            <div className='login__container'>
                <img src={logo} />
                <div className='login__text'>
                    <h1> Sign in to Whatsapp</h1>
                </div>
                <Button type='submit' onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login
