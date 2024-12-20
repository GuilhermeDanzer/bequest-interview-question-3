import React, { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080'

function App() {
  const [data, setData] = useState<string>()
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await fetch(API_URL)
      const result = await response.json()

      if (result.error) {
        setMessage(result.error)
      } else {
        setMessage('')
        setData(result.data)
      }
    } catch (error) {
      setMessage('Failed to fetch data.')
    }
  }

  const updateData = async () => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      await getData()
    } catch (error) {
      setMessage('Failed to update data.')
    }
  }

  const verifyData = async () => {
    try {
      const response = await fetch(API_URL)
      const result = await response.json()

      if (result.error) {
        setMessage(result.error)
      } else {
        setMessage('Data integrity verified.')
      }
    } catch (error) {
      setMessage('Error verifying data integrity.')
    }
  }

  const recoverData = async () => {
    try {
      const response = await fetch(`${API_URL}/recover`, { method: 'POST' })
      const result = await response.json()

      if (result.error) {
        setMessage(result.error)
      } else {
        setMessage(result.message)
        setData(result.data)
      }
    } catch (error) {
      setMessage('Error recovering data.')
    }
  }

  const corruptData = async () => {
    try {
      const response = await fetch(`${API_URL}/corrupt`, { method: 'POST' })
      const result = await response.json()

      if (result.message) {
        setMessage(result.message)
      }
    } catch (error) {
      setMessage('Error corrupting data.')
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        position: 'absolute',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontSize: '30px',
      }}>
      <div>Saved Data</div>
      <input
        style={{ fontSize: '30px' }}
        type="text"
        value={data}
        onChange={e => setData(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ fontSize: '20px' }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: '20px' }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: '20px' }} onClick={recoverData}>
          Recover Data
        </button>
        <button
          style={{ fontSize: '20px', color: 'red' }}
          onClick={corruptData}>
          Corrupt Data
        </button>
      </div>
      {message && (
        <div style={{ color: 'red', fontSize: '20px' }}>{message}</div>
      )}
    </div>
  )
}

export default App
