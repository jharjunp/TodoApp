import ShowImage from './showImage.jsx'

const Steps = ({ args }) => {
  return (
    <div className="home-steps">
      <h2 className="home-text14">
        <span>Our Approach</span>
      </h2>
      <div className="home-container2">
        <div className="home-container3">
          <div className="home-step">     
            <ShowImage imageName={"Steps1.png"} textLines={[]} />  
            <h1 className="home-text16">
              <span>1</span>
            </h1>
            <h1 className="home-text18">
              <span>Concept</span>
            </h1>
            <span className="home-text21">
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing.</span>
              <br></br>
            </span>
          </div>
          <div className="home-step">
            <ShowImage imageName={"Steps2.png"} textLines={[]} /> 
            <h1 className="home-text26">
              <span>2</span>
            </h1>
            <h1 className="home-text18">
              <span>Prototype</span>
            </h1>
            <span className="home-text30">
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing.</span>
              <br></br>
            </span>
          </div>
        </div>
        <div className="home-container4">
          <div className="home-step">
            <ShowImage imageName={"Steps3.png"} textLines={[]} /> 
            <h1 className="home-text35">
              <span>3</span>
            </h1>
            <h1 className="home-text18">
              <span>Production</span>
            </h1>
            <span className="home-text40">
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing.</span>
              <br></br>
            </span>
          </div>
          <div className="home-step">
            <ShowImage imageName={"Steps4.png"} textLines={[]} /> 
            <h1 className="home-text45">
              <span>4</span>
            </h1>
            <h1 className="home-text18">
              <span>Shipping</span>
            </h1>
            <span className="home-text49">
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing.</span>
              <br></br>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
