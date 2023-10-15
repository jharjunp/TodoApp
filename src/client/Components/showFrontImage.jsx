import imgUrl from "../Images/Aloituskuva.png";
import '../CSS/home.css';

const ShowFrontImage = ({ args, textLines }) => {
  return (
    <div className="home-front-card">
      <img alt="image" src={imgUrl} className="home-frontImage" />
      <div className="overlay-frontText">
        {textLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};
export default ShowFrontImage;
