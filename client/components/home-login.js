import React from 'react'
import Head from './head'
import LoginForm from './loginForm'

const Home = () => {
  return (
    <div>
      <Head title="myapp" />
      <LoginForm />
    </div>
  )
}

Home.propTypes = {}

export default Home
