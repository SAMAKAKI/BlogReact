/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from "react-router-dom"
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { RxCross2, RxCheck } from "react-icons/rx";

const DashComment = () => {
  const { currentUser } = useSelector(state => state.user)
  const [comments, setComments] = useState({})
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  useEffect(() => {
    const getComments = async () => {
      try {
        await axios.get(`/api/comment/getComments`).then((res) => {
          if(res.status === 200){
            setComments(res.data.comments)
            if(res.data.comments.length < 9)
              setShowMore(false)
          }
        }).catch((err) => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    }
    if(currentUser.isAdmin) 
      getComments()
  }, [currentUser._id, currentUser.isAdmin])

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      await axios.get(`/api/comment/getComments?startIndex=${startIndex}`).then(res => {
        if(res.status === 200){
          setComments((prev) => [...prev, ...res.data.comments])
          if(res.data.comments.length < 9)
            setShowMore(false)
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      await axios.delete(`/api/comment/deleteComment/${commentIdToDelete}`, {headers: {
        'Content-Type': 'application/json'
      }}).then((res) => {
        if(res.status === 200){
          setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post id</Table.HeadCell>
              <Table.HeadCell>User id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments?.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true)
                      setCommentIdToDelete(comment._id)
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show more</button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure, you want delete this comment?</h3>
            <div className="flex justify-center gap-5">
              <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComment
