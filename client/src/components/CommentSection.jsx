/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Textarea, Modal } from 'flowbite-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [comments, setComments] = useState([])
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

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

  const handleLike = async (commentId) => {
    try {
      if(!currentUser){
        navigate('/sign-in')
        return
      }

      await axios.put(`/api/comment/likeComment/${commentId}`, {headers: {'Content-Type': 'application/json'}}).then(res => {
        if(res.status === 200)
          setComments(comments.map((comment) => 
            comment._id === commentId ? {
              ...comment,
              likes: res.data.likes,
              numberOfLikes: res.data.likes.length
            } : comment
          ))
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async (comment, editedComment) => {
    setComments(comments.map((c) => c._id === comment._id ? {...c, content: editedComment} : c))
  }

  const handleDelete = async (commentId) => {
    try {
      if(!currentUser){
        navigate('/sign-in')
        return
      }

      await axios.delete(`/api/comment/deleteComment/${commentId}`, {headers: {'Content-Type': 'application/json'}}).then(res => {
        if(res.status === 200){
          setComments(comments.filter((comment) => comment._id !== commentId))
          setShowModal(false)
        }
      }).catch(err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

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
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
              setShowModal(true)
              setCommentToDelete(commentId)
            }}/>
          ))}
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure, you want delete this comment?</h3>
            <div className="flex justify-center gap-5">
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection
