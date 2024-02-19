/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux'
import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react' 
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, signInStart } from '../redux/user/userSlice' 
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DashProfile = () => {
  const { currentUser } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null)
  const [formData, setFormData] = useState({})
  const [imageFileUploading, setImageFileUploading ] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess ] = useState(null)
  const [updateUserError, setUpdateUserError ] = useState(null)
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file)
      setImageFile(file)
    setImageFileUrl(URL.createObjectURL(file))
  }
  useEffect(() => {
    if(imageFile)
      uploadFile()
  }, [imageFile])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const uploadFile = async () =>{
    setImageFileUploadingError(null)
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setImageFileUploadingProgress(progress.toFixed(0))
    }, (error) => {
      setImageFileUploadingError('Could not upload image (File must be less than 2MB)')
      setImageFileUploadingProgress(null)
      setImageFileUrl(null)
      setImageFile(null)
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL)
        setFormData({...formData, profilePicture: downloadURL})
        setImageFileUploading(false)
      })
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made')
      return;
    }

    if(imageFileUploading){
      setUpdateUserError('Please wait for image to upload')
      return;
    }

    try {
      dispatch(signInStart())
      await axios.put(`/api/user/update/${currentUser._id}`, formData, { 
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if(res.status === 200){
          dispatch(updateSuccess(res.data))
          setUpdateUserSuccess("User's profile updated successfully")
        }
      }).catch((err) => {
        dispatch(updateFailure(err))
        setUpdateUserError(err)
      }) 
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className='hidden' type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef}/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
          {imageFileUploadingProgress && (
            <CircularProgressbar value={imageFileUploadingProgress || 0} text={`${imageFileUploadingProgress}%`} strokeWidth={5} styles={{
              root: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }, path: {
                stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
              }
            }} />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user photo" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} onClick={() => {filePickerRef.current.click()}} />
        </div>
        { imageFileUploadingError && <Alert color='failure'>{ imageFileUploadingError }</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
      )}
    </div>
  )
}

export default DashProfile
