import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import { app } from '../fireBaseConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/authSlice';


export const GoogleOuth = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const auth = getAuth(app);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account', // Forces the account selection prompt
        });

        try {
            // Google authentication
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = resultFromGoogle.user;

            // API call to your backend for further user handling
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/auth/googleouth`,
                { displayName, email, photoURL },
                { withCredentials: true },{
                    headers: {
                        Authorization: `Bearer ${currentUser.currentToken}`,
                    }
                    
                }
            );

            // Handle the response
            if (response.status === 200 && response.data) {
                dispatch(signInSuccess(response.data));
                navigate('/'); // Redirect to the home page
            } else {
                console.error('Failed to authenticate the user with backend.');
            }
        } catch (error) {
            console.error('Google authentication error:', error);
            dispatch(signInFailure()); // Dispatch failure action
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            outline
            onClick={handleGoogleLogin}
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </Button>
    );
};
