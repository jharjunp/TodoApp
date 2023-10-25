import '../CSS/home.css';

const ShowImage = ({ imageName, textLines }) => {
  const imgUrl = getImageUrl(imageName)
  
  return (
    <div className="home-card">
      <img alt="image" src={imgUrl} className="home-image" />
      <div className="home-overlay-text">
        {textLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

function getImageUrl(name) {
  return new URL(`../Images/${name}`, import.meta.url).href
}

export default ShowImage;
