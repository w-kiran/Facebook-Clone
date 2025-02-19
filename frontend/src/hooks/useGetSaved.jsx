import { setUserSavedPost } from '@/redux/authSlice'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BACKEND_URL } from '../../configURL'

const useGetSaved = () => {
    const dispatch = useDispatch()
    const {user} = useSelector(store=>store.auth)
    const [fetched,setFetched] = useState(false)

    useEffect(()=>{
        if (!user) return; 
        const fetchSaved = async ()=>{

        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/post/userpost`,
                {withCredentials:true}
            )
            if(res.data.success){
             dispatch(setUserSavedPost(res.data.userPost));
             setFetched(true)
            }
        } catch (error) {
            console.log(error)
        }}
        
        if(user && !fetched){
            fetchSaved()
        }
    },[user])

  return (
   null
  )
}

export default useGetSaved