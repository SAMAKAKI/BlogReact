/* eslint-disable no-unused-vars */
import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const DashSidebar = () => {
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
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item as='button' active={tab === 'profile'} icon={HiUser} label={"User"} labelColor='dark'>Profile</Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
