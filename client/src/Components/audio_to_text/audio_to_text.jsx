import React, { useState, useRef, useEffect } from "react";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import FastForwardIcon from "@material-ui/icons/FastForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import qs from "qs";
import "./audio_to_text.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function AudioPlayer() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState("");

  const [filename, setfilename] = useState("");
  const [url, seturl] = useState("");
  const { fileId } = useParams();

  useEffect(() => {
    console.log(fileId);

    axios.get(`http://localhost:3002/a2t/getfileData/${fileId}`).then((res) => {
      console.log(res.data);
      setfilename(res.data.file_name);

      seturl(res.data.file_url);
    });
  }, []);

  const handleTimeUpdate = () => {
    const newTime = audioRef.current.currentTime;
    setCurrentTime(newTime);
  };

  const handlePlayback = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleForward = () => {
    audioRef.current.currentTime += 10;
  };

  const handleBackward = () => {
    audioRef.current.currentTime -= 10; // Backward 10 seconds
  };
  const handleTranscript = () => {
    console.log("loading...");
    const data = {
      audio_url: url,
    };

    const formData = qs.stringify(data);

    axios
      .post("http://127.0.0.1:5000/transcribe", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="audio2text">
      <div className="audio">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Link to="/reviewer_dashboard">
            <ArrowBackIcon style={{ color: "black", fontSize: "1.5rem" }} />
          </Link>
          <h4>{filename}</h4>
        </div>

        <div className="AudioPlayer">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            src={url}
            type="audio/wav"
          >
            Your browser does not support the audio element.
          </audio>
          <div className="audio_content">
            <input
              className="audio_range"
              type="range"
              min={0}
              max={audioRef.current ? audioRef.current.duration : 0}
              value={currentTime}
              onChange={(e) => {
                setCurrentTime(e.target.value);
                audioRef.current.currentTime = e.target.value;
              }}
            />
            <div className="buttons-container">
              <button onClick={handleBackward}>
                <FastRewindIcon />
              </button>
              <button onClick={handlePlayback}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </button>
              <button onClick={handleForward}>
                <FastForwardIcon />
              </button>
            </div>
          </div>
          <div className="transcribe">
            <button onClick={handleTranscript}>TRANSCRIBE</button>
          </div>
        </div>
        <div>
          <textarea
            value={data}
            defaultValue={"Auto-generated text will appear here"}
            className="audio_textarea"
            style={{}}
            readOnly
          />
        </div>
        <div className="trans_next">
          <button disabled={!data}>NEXT</button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
