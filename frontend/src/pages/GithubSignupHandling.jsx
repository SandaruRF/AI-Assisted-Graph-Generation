import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import {handleGitHubAuthCallback} from "../services/api";

const GitHubCallback = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    handleGitHubAuthCallback(code, Navigate)
    
  }, [Navigate]);

  return <Loading />; 
};

export default GitHubCallback;
