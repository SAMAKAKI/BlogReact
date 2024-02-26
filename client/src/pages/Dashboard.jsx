/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPost from '../components/DashPost'
import DashUsers from '../components/DashUsers'
import DashComment from '../components/DashComment'
import DashDash from '../components/DashDash'

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl)
      setTab(tabFromUrl)
    if(!tab)
      navigate('/dashboard?tab=dash')

  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === 'profile' && (
        <DashProfile />
      )}
      {tab === 'posts' && (
        <DashPost />
      )}
      {tab === 'users' && (
        <DashUsers />
      )}
      {tab === 'comments' && (
        <DashComment />
      )}
      {tab === 'dash' && (
        <DashDash />
      )}
    </div>
  )
}

export default Dashboard
