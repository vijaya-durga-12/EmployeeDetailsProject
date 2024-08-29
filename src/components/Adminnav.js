import React from 'react'
import Navv from './Navv'
import { Outlet } from 'react-router-dom'

const Adminnav = () => {
  return (
    <div>
        <Navv/>
        <Outlet />
    </div>
  )
}

export default Adminnav