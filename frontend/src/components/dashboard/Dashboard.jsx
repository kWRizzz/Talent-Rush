import React, { useEffect } from 'react'

import {
    useDispatch,
    useSelector
} from "react-redux"

import {
    fetchMyInterviews
} from "../../redux/slices/interviewSlice"
import MainLayout from '../layout/MainLayout'
import InterviewCard from './InterviewCard'
import InterviewList from './InterviewList'


const Dashboard = () => {

    const dispatch= useDispatch();

    const {interviews,isLoading}= useSelector(
        (state)=>state.interview
    )
    useEffect(() => {
        dispatch(
            fetchMyInterviews()
        )
    }, [dispatch])
    
    return (
        <MainLayout>
            <h1>
                Dashboard   
            </h1>
            {
                isLoading
                ?
                <div>
                    loading....
                </div>
                :
                <div
                    className=' grid gap-2'
                >
                    <InterviewList
                        interviews={interviews}
                    />
                </div>
            }
        </MainLayout>
    )
}

export default Dashboard