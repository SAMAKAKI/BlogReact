/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { HiAnnotation, HiArrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi"
import { Button, Table, TableCell } from 'flowbite-react'
import { Link } from "react-router-dom"

const DashDash = () => {
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [posts, setPosts] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [lastMouthUsers, setLastMouthUsers] = useState(0)
  const [lastMouthComments, setLastMouthComments] = useState(0)
  const [lastMouthPosts, setLastMouthPosts] = useState(0)

  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    const getUsers = async () => {
      await axios.get(`/api/user/getUsers?limit=5`, {headers: {"Content-Type": "application/json"}}).then(res => {
        if(res.status === 200){
          setUsers(res.data.users)
          setTotalUsers(res.data.totalUsers)
          setLastMouthUsers(res.data.lastMonthUsers)
        }
      }).catch(err => {
        console.log(err);
      })
    }
    const getComments = async () => {
      await axios.get(`/api/comment/getComments?limit=5`, {headers: {"Content-Type": "application/json"}}).then(res => {
        if(res.status === 200){
          setComments(res.data.comments)
          setTotalComments(res.data.totalComments)
          setLastMouthComments(res.data.lastMouthComments)
        }
      }).catch(err => {
        console.log(err);
      })
    }
    const getPosts = async () => {
      await axios.get(`/api/post/getPosts?limit=5`, {headers: {"Content-Type": "application/json"}}).then(res => {
        if(res.status === 200){
          setPosts(res.data.posts)
          setTotalPosts(res.data.totalPosts)
          setLastMouthPosts(res.data.lastMonthPosts)
        }
      }).catch(err => {
        console.log(err);
      })
    }

    if(currentUser.isAdmin){
      getUsers()
      getComments()
      getPosts()
    }

  }, [currentUser])

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p> 
            </div>
            <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg"/>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp />
              {lastMouthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p> 
            </div>
            <HiDocumentText className="bg-lime-500 text-white rounded-full text-5xl p-3 shadow-lg"/>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp />
              {lastMouthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
              <p className="text-2xl">{totalComments}</p> 
            </div>
            <HiAnnotation className="bg-indigo-500 text-white rounded-full text-5xl p-3 shadow-lg"/>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowUp />
              {lastMouthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center items-start">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button gradientDuoTone='purpleToPink' outline>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && users.map(user => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
                  <TableCell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-500"/>
                  </TableCell>
                  <TableCell>
                    {user.username}
                  </TableCell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button gradientDuoTone='purpleToPink' outline>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Post category</Table.HeadCell>
            </Table.Head>
            {posts && posts.map(post => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
                  <TableCell>
                    <img src={post.image} alt={post.title} className="w-14 h-10 rounded-md bg-gray-500"/>
                  </TableCell>
                  <TableCell className="w-96">
                    {post.title}
                  </TableCell>
                  <TableCell className="w-5">
                    {post.category}
                  </TableCell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button gradientDuoTone='purpleToPink' outline>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.map(comment => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
                  <TableCell className="w-96">
                    <p className="line-clamp-2">{comment.content}</p>
                  </TableCell>
                  <TableCell>
                    {comment.numberOfLikes}
                  </TableCell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DashDash
