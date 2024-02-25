/* eslint-disable no-unused-vars */
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UpdatePost = () => {
  const { currentUser } = useSelector(state => state.user)
  const { postId } = useParams()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const getPost = async () => {
        await axios.get(`/api/post/getPosts?postId=${postId}`).then((res) => {
          if(res.status === 200){
            setPublishError(null)
            setFormData(res.data.posts[0])
          }
        }).catch((err) => {
          setPublishError(err)
        })
      }
      getPost()
    } catch (error) {
      setPublishError(error)
    }
  }, [postId])

  const handleUploadImage = async () =>{
    try {
      if(!file){
        setImageUploadError('Please select an image')
        return
      }
      setImageUploadError(null)
      const storage = getStorage(app)
      const fileName = `${new Date().getTime()}-${file.name}` 
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      }, (error) => {
        setImageUploadError('Image upload failed')
        setImageUploadProgress(null)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUploadProgress(null)
          setImageUploadError(null)
          setFormData({...formData, image: downloadUrl})
        })
      })
    } catch (error) {
      setImageUploadError('Image upload failed')
      setImageUploadProgress(null)
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/post/updatePost/${formData._id}/${currentUser._id}`, formData, {headers: {'Content-Type': 'application/json'}}).then((res) => {
        if(res.status === 200){
          setPublishError(null)
          navigate(`/post/${res.data.slug}`)
        }
      }).catch(err => {
        setPublishError(err)
      })
    } catch (error) {
      setPublishError(error)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title}/>
          <Select onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="next.js">Next.js</option>
            <option value="react.js">React.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            {imageUploadProgress ? <div className='w-16 h-16'>
              <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
            </div> : 'Upload image'}
          </Button>
        </div>
          {imageUploadError && (
            <Alert color='failure'>{imageUploadError}</Alert>
          )}
          {formData.image && (
            <img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>
          )}
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required onChange={(value) => setFormData({...formData, content: value})} value={formData.content}/>
        <Button type='submit' gradientDuoTone='purpleToPink' outline>Update</Button>
        {publishError && (
          <Alert color='failure' className='mt-5'>{publishError}</Alert>
        )}
      </form>
    </div>
  )
}


export default UpdatePost
