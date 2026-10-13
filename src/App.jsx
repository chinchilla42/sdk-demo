import { useFeatureFlags } from './useFeatureFlags'
import './App.css';

// -- Banner width for each value of the banner "size" variable --
const BANNER_WIDTHS = {
  small: "750px",
  medium: "1000px",
  large: "1250px",
};

function App() {
  const { featureFlagsData, trackBannerClick } = useFeatureFlags()

  // -- Set banner size based on feature flag value --
  const size = BANNER_WIDTHS[featureFlagsData.banner?.size];

  return (
    <div className="App">
      <h1 className="title">Welcome! Your visitorCode is:</h1>
      <h2 className="visitorCode">{featureFlagsData.visitorCode}</h2>
      <div className="card">
        {featureFlagsData.visible_card_image?.image && <img src="https://www.pngall.com/wp-content/uploads/13/Capybara-PNG-Picture.png" alt="animal" />}
        <h3>Display image</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua!</p>
      </div>
      <h2 className="subtitle">Change size ({featureFlagsData.banner?.size}) and color ({featureFlagsData.banner?.background_color}) of banner</h2>
      <div className="banner" style={{width: size, backgroundColor: featureFlagsData.banner?.background_color}}>
        <h3>Banner title</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <button onClick={trackBannerClick}>Click me</button>
      </div>
      <h2 className="subtitle">Change block order</h2>
      <div className="container-block">
        <div className="block-red" style={{order: featureFlagsData.order_of_blocks?.red_block}}></div>
        <div className="block-blue" style={{order: featureFlagsData.order_of_blocks?.blue_block}}></div>
        <div className="block-green" style={{order: featureFlagsData.order_of_blocks?.green_block}}></div>
      </div>
    </div>
  );
}

export default App;
