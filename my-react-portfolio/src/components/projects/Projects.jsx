import { useEffect, useState } from "react";
import { Header } from "../common/Header";
import { ProjectCard } from "./ProjectCard";
import "./projects.css";

const GITHUB_API = "https://api.github.com/users/Maria-Manuela/repos";
const REPOS_PER_PAGE = 30;

const parseLinkHeader = (header) => {
  return header.split(", ").reduce((links, part) => {
    const [url, rel] = part.split("; ");
    links[rel.replace(/"/g, "").replace("rel=", "")] = url.slice(1, -1);
    return links;
  }, {});
};

export const Projects = () => {
  const [gitData, setGitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAllProjects = async () => {
      try {
        let allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `${GITHUB_API}?page=${page}&per_page=${REPOS_PER_PAGE}`,
            { signal: abortController.signal }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch projects (${response.status})`);
          }

          const repos = await response.json();
          allRepos = allRepos.concat(repos);

          const linkHeader = response.headers.get("Link");
          hasMore = Boolean(linkHeader && parseLinkHeader(linkHeader).next);
          if (hasMore) page += 1;
        }

        const projectRepos = allRepos.filter((repo) =>
          repo.name.startsWith("project")
        );

        setGitData(projectRepos);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAllProjects();

    return () => abortController.abort();
  }, []);

  return (
    <section className="projects-container">
      <Header
        level={1}
        className={"projects-heading"}
        text={"Featured Projects"}
      />
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">An error occurred: {error.message}</p>
      ) : (
        <ProjectCard repositories={gitData} />
      )}
    </section>
  );
};
