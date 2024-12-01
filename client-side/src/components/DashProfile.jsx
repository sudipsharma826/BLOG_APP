import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextInput, Button } from 'flowbite-react';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const ImageUrl=currentUser.photoURL;

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageFileUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission logic here
      console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          className='hidden'
          id='imageInput'
        />
        <div 
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
          onClick={() => document.getElementById('imageInput').click()}
        >
          <img
            src={ImageUrl}
            alt={currentUser.username}
            className='rounded-full w-full h-full object-cover border-4 border-[lightgray]'
            crossOrigin="anonymous"
          />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          className='bg-gray-50'
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser?.email}
          className='bg-gray-50'
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='Enter the New Password'
          className='bg-gray-50'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
    </div>
  );
}