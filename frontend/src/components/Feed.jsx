import React from 'react'
import Posts from './Posts'
import CreatePost from './CreatePost'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
      <CreatePost/>
        <Posts/>
    </div>
  )
}

export default Feed