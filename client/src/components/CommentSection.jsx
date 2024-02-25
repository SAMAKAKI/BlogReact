/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Button, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Comment from './Comment'

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [comments, setComments] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(comment.length > 200)
      return
    try {
      await axios.post('/api/comment/create', {
        content: comment,
        postId,
        userId: currentUser._id
      }, {headers: {
        'Content-Type': 'application/json'
      }}).then(res => {
        if(res.status === 200){
          setCommentError(null)
          setComment('')
          setComments([res.data, ...comments])
        }
      }).catch(err => {
        setCommentError(err)
      })
    } catch (error) {
      setCommentError(error)
    }
  }
  useEffect(() => {
    const getComments = async () => {
      try {
        await axios.get(`/api/comment/getPostComments/${postId}`, {headers: {'Content-Type': 'application/json'}}).then(res => {
          if(res.status === 200)
            setComments(res.data)
        }).catch(err => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    }
    getComments()
  }, [postId])

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as: </p>
          <img src={currentUser.profilePicture} alt={currentUser.username} className='w-5 h-5 object-cover rounded-full'/>
          <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500 hover:underline'>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment. 
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea placeholder='Add a comment...' rows='3' maxLength='200' onChange={(e) => setComment(e.target.value)} value={comment}/>
          <div className="flex justify-between items-center mt-5">
            <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
          </div>
          { commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment}/>
          ))}
        </>
      )}
    </div>
  )
}

export default CommentSection
