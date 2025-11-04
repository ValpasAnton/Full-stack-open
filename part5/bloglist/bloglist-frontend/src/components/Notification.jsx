import '../index.css'

const Notification = ({ message }) => {
  if (!message || !message.content) {
    return null
  }

  return (
    <div className={message.positive ? 'success' : 'error'}>
      {message.content}
    </div>
  )
}

export default Notification
