import React from 'react'
import { Routes, Route} from "react-router-dom"
import Home from "./assets/pages/Home"
import Posts from "./assets/pages/Posts"

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Posts />} />
    </Routes>
  )
}

export default App
