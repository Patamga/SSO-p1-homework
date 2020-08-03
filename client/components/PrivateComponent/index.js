import React from 'react'


const PrivateComponent = () => {
  return (
    <div className="font-sans antialiased h-screen flex">
      <div className="w-screen h-screen bg-gray-300 flex justify-center items-center italic text-xl">
        Nice to see you!
      </div>
    </div>
  )
}

PrivateComponent.propTypes = {}

export default React.memo(PrivateComponent)
