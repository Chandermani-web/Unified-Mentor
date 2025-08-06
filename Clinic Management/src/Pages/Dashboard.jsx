import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const UserDetails = useSelector((state) => state.signin);
  const UserActiveRole = UserDetails.activeRole;
  const [role, setRole] = useState(UserActiveRole);
  
  return (
    <div>
      {
        role === "doctor" ? (
          <div>
            Doctor
          </div>
        ) : (
          <div>
            Receptionist
          </div>
        )
      }
    </div>
  )
}

export default Dashboard
