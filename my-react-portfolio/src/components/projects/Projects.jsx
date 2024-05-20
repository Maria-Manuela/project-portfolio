import { useEffect, useState } from "react";
import { Header } from "../common/Header";
import { ProjectCard } from "./ProjectCard";
import "./projects.css";

const API = "https://api.github.com/users/Maria-Manuela/repos";

//component to fetch data from API
export const Projects = () => {
  const [gitData, setGitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //function to fetch the API data
  const fetchProjects = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Problem fetching API data");
      }

      const rawData = await response.json();
      setGitData(rawData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError(error);
      setLoading(false); // Set loading to false if there's an error
      console.error(error);
    }
  };

  //handle Fetch
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section className="projects-container">
      <Header
        level={1}
        className={"projects-heading"}
        text={"Featured Projects"}
      />
      {loading ? ( // Display loading state while fetching data
        <p className="loading-message">Loading...</p>
      ) : error ? ( // Display error message if there's an error
        <p className="error-message">An error occurred: {error.message}</p>
      ) : (
        <ProjectCard repositories={gitData} />
      )}
    </section>
  );
};
