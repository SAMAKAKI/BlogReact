/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

const PostPage = () => {
  const { postSlug } = useParams()
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ post, setPost ] = useState(null)
  const [ recentPosts, setRecentPosts ] = useState([])

  useEffect(() => {
    const getPost  = async () => {
      try {
        setLoading(true)
        await axios.get(`/api/post/getPosts?slug=${postSlug}`).then(res => {
          if(res.status === 200){
            setPost(res.data.posts[0])
            setLoading(false)
            setError(false)
          }
        }).catch(err => {
          setError(true)
          setLoading(false)
        })
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    getPost()
  }, [postSlug])

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        await axios.get(`/api/post/getPosts?limit=3`, {
          headers: {
            "Content-Type": 'application/json'
          }
        }).then(res => {
          if(res.status === 200)
            setRecentPosts(res.data.posts)
        }).catch(err => {
          console.log(err);
        })
      }
      getRecentPosts()
    } catch (error) {
      console.log(error);
    }
  }, [])

  if(loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  )

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl mt-10 p-3 font-serif max-w-2xl mx-auto lg:text-4xl'>{ post && post.title }</h1>
      <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{ post && new Date(post.createdAt).toLocaleDateString() }</span>
        <span className='italic'>{ post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-xl my-5'>Recent articles</h1>
        <div className="flex flex-wrap gap-5 justify-center items-center">
          { recentPosts && recentPosts.map((postCard) => (
            <PostCard key={postCard._id} post={postCard}/>
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostPage
