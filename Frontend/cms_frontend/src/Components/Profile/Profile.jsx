import React from 'react'
import Dashboard from './DashBoard'
import MyPolicies from './MyPolicies'
import MyClaims from './MyClaims'

function Profile() {
  return (
    <>
        <Dashboard/>
        <MyPolicies/>
        <MyClaims/>
    </>
  )
}

export default Profile