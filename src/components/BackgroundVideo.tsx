import './BackgroundVideo.css';

const BackgroundVideo = ( props: { content: any; }) => {
    const { content } = props
  return (
    <div className="background-video-container">
      <video autoPlay loop muted className="background-video">
        <source src="https://res.wx.qq.com/t/wx_fed/finder/static-assets/finder-common-assets/res/finder-helper/2560x864_helper.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        {
            content
        }
      </div>
    </div>
  );
};

export default BackgroundVideo;
