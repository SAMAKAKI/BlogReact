/* eslint-disable no-unused-vars */
import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup,  } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { FaRegCommentDots } from "react-icons/fa6";

const DashSidebar = () => {
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl)
      setTab(tabFromUrl)
    
  }, [location.search])

  const handleSignOut = async () => {
    try {
      await axios.post('/api/user/sign-out').then((res) => {
        if(res.status !== 200)
          console.log(res.data)
        else
          dispatch(signOutSuccess())
      }).catch((err) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error.message)
    }
  }


  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark'>Profile</Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Link to={'/dashboard?tab=posts'}>
                <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText}>Posts</Sidebar.Item>
              </Link>
              <Link to={'/dashboard?tab=users'}>
                <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup}>Users</Sidebar.Item>
              </Link>
              <Link to={'/dashboard?tab=comments'}>
                <Sidebar.Item as='div' active={tab === 'comments'} icon={FaRegCommentDots}>Comments</Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
