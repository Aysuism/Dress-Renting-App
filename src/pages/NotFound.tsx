import error from '../assets/img/errorr.gif'

const NotFound = () => {
  return (
    <div className='flex justify-center'>
        <img src={error} alt="error-gif" className='h-screen'/>
    </div>
  )
}

export default NotFound