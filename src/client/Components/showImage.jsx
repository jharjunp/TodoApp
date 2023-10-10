import imgUrl from '../Images/RelayList.png'

const ShowImage = ({ args }) => {
  return <div className="home-gallery-card">
    <img
      alt="image"
      img src={imgUrl}
      className="home-image1" />
    <h2 className="home-text54">Project Title</h2>
    <span className="home-text55">Lorem ipsum dolor sit amet</span>
  </div>
}

export default ShowImage