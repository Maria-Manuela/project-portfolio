import { useMemo, useState } from "react";
import localProjectsData from "./projects.json";
import { Header } from "../common/Header";
import { Paragraph } from "../common/Paragraph";
import { Label } from "../common/Label";
import { Button } from "../common/Button";
import { Image } from "../common/Image";
import "./projects.css";

const INITIAL_VISIBLE = 3;

export const ProjectCard = ({ repositories }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const orderedProjects = useMemo(() => {
    const repoMap = new Map(
      repositories.map((repo) => [repo.name, repo])
    );

    return [...localProjectsData.projects]
      .sort((a, b) => a.id - b.id)
      .map((project) => ({
        project,
        repo: repoMap.get(project.repoName),
      }))
      .filter(({ repo }) => repo != null);
  }, [repositories]);

  const visibleProjects = orderedProjects.slice(0, visibleCount);
  const isExpanded = visibleCount > INITIAL_VISIBLE;
  const showToggle = orderedProjects.length > INITIAL_VISIBLE;

  const toggleVisibleCards = () => {
    setVisibleCount((prev) =>
      prev === INITIAL_VISIBLE ? orderedProjects.length : INITIAL_VISIBLE
    );
  };

  return (
    <>
      {visibleProjects.map(({ project, repo }) => (
        <article className="project-card" key={project.id}>
          <div
            className="project-img-container"
            data-repo={project.repoName}
          >
            <Image
              sectionClassName={"image"}
              elementClassName={"project-img"}
              src={project.imageUrl}
              alt={`Image of ${project.displayName} project`}
            />
          </div>
          <div className="project-text-section">
            <Header
              level={3}
              text={project.displayName}
              aria-label="This is the main heading"
              className="project-card-heading"
            />
            <Paragraph text={repo.description} className="project-paragraph" />

            <div role="group" aria-label="Project Tags" className="tags">
              {project.tags.map((tag, index) => (
                <Label key={index} tagText={tag} />
              ))}
            </div>

            <div className="button-wrapper">
              <Button
                icon="/icons/live-demo.svg"
                label="Live demo"
                link={repo.homepage}
                className="netlify-btn"
              />
              <Button
                icon="/icons/github.svg"
                label="View the code"
                link={repo.svn_url}
                className="github-btn"
              />
            </div>
          </div>
        </article>
      ))}

      {showToggle && (
        <div className="btn-wrapper">
          <Button
            label={isExpanded ? "Show Less" : "Show More"}
            className="show-more-btn"
            onClick={toggleVisibleCards}
            ariaLabel={isExpanded ? "Show Less" : "Show More"}
          />
        </div>
      )}
    </>
  );
};
