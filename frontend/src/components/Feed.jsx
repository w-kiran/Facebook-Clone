import React from 'react'
import Posts from './Posts'
import CreatePost from './CreatePost'

const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center justify-center px-4 sm:px-8">
    <CreatePost />
    <div className="w-full">
        <Posts />
    </div>
</div>

  )
}

export default Feed