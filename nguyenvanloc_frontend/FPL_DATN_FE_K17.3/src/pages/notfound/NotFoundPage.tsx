import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="error-container" style={{ marginTop: "60px" }}>
      <img className='image20' src="https://st5.depositphotos.com/2466369/66485/v/450/depositphotos_664857888-stock-illustration-page-found-concept-people-scene.jpg" alt="Error Image" />
      <div className="error-content">
        <h1 className='notfound1'>Ối! Đã xảy ra lỗi.</h1>
        <p className='notfound2'>Chúng tôi rất tiếc nhưng có vẻ như đã xảy ra lỗi.</p>
        <p className='notfound2'>Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.</p>
      </div>
    </div>
  )
}

export default NotFoundPage