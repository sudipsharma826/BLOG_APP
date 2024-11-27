import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import { app } from '../fireBaseConfig';

export const GoogleOuth = () => {
    const auth = getAuth(app);
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        })
        try{
            const resultFromGoogle = await signInWithPopup(auth, provider);
            
        }catch(error){
            console.log(error);
            
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleLogin}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
