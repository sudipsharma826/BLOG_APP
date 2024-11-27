import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import React from 'react'

export const GoogleOuth = () => {
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline >
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
