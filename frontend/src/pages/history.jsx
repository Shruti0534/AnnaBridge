import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import { IconButton } from '@mui/material'

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext)
  const [meetings, setMeetings] = useState([])
  const routeTo = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser()
        setMeetings(history)
      } catch {
        
      }
    }

    fetchHistory()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div>
      <IconButton onClick={() => routeTo("/home")}>
        <HomeIcon />
      </IconButton>

      {meetings.length !== 0 ? (
        meetings.map((e) => (
          <Card key={e._id} variant="outlined" sx={{ my: 2 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Code: {e.meetingCode}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Date: {formatDate(e.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          No meetings found.
        </Typography>
      )}
    </div>
  )
}
