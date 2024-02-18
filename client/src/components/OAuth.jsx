/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase' 
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice' 
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = getAuth(app)
  let data = {}
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      await axios.post('/api/auth/google', {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        data = res.data
      }).catch((err) => {
        console.log(err);
      })

      if(data){
        dispatch(signInSuccess(data))
        navigate('/')
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6'/>
      Continue with Google
    </Button>
  )
}

export default OAuth
