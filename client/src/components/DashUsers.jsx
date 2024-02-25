/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from "react-router-dom"
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { RxCross2, RxCheck } from "react-icons/rx";

const DashUsers = () => {
  const { currentUser } = useSelector(state => state.user)
  const [users, setUsers] = useState({})
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  useEffect(() => {
    const getPosts = async () => {
      try {
        await axios.get(`/api/user/getUsers`).then((res) => {
          if(res.status === 200){
            setUsers(res.data.users)
            if(res.data.users.length < 9)
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
      getPosts()
  }, [currentUser._id, currentUser.isAdmin])

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      await axios.get(`/api/post/getUsers?startIndex=${startIndex}`).then(res => {
        if(res.status === 200){
          setUsers((prev) => [...prev, ...res.data.users])
          if(res.data.users.length < 9)
            setShowMore(false)
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      await axios.delete(`/api/user/deleteUser/${userIdToDelete}/${currentUser._id}`, {headers: {
        'Content-Type': 'application/json'
      }}).then((res) => {
        if(res.status === 200){
          setUsers((prev) => prev.filter((post) => post._id !== userIdToDelete))
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
      {currentUser.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users?.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover rounded-full bg-gray-500"/>
                  </Table.Cell>
                  <Table.Cell>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>{!user.isAdmin ? <RxCross2 className="text-red-500 text-lg font-bold"/> : <RxCheck className="text-green-500 text-xl font-bold" />}</Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true)
                      setUserIdToDelete(user._id)
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
        <p>You have no users yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure, you want delete this user?</h3>
            <div className="flex justify-center gap-5">
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashUsers
