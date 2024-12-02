import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import { app } from '../fireBaseConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/authSlice';

export const GoogleOuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = resultFromGoogle.user;

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/googleouth`, {
                displayName,
                email,
                photoURL
            });

            if (response.status === 200 && response.data) {
                if (response.data.email === email) {
                    dispatch(signInSuccess(response.data));
                    navigate('/');
                } else {
                    console.error('Received user data does not match authenticated user');
                }
            }
        } catch (error) {
            console.error('Google authentication error:', error);
        }
    }

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleLogin}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}