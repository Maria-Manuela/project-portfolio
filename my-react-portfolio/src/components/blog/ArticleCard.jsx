import { Button } from "../common/Button";
import { Header } from "../common/Header";
import { Image } from "../common/Image";
import { Label } from "../common/Label";
import { Paragraph } from "../common/Paragraph";

export const ArticleCard = ({
  imageUrl,
  title,
  tagText,
  description,
  link,
}) => {
  return (
    <div className="article-card">
      <div className="article-img-container">
        <Image
          sectionClassName="image"
          elementClassName="article-img"
          src={imageUrl}
          alt={title}
        />
      </div>
      <div className="article-text">
        <Label tagText={tagText} className="article-tag" />
        <Header
          level={3}
          text={title}
          aria-label="Heading of the article"
          className="article-header"
        />
      </div>
      <Paragraph text={description} className="custom-paragraph" />
      <Button
        icon="./icons/doc.svg"
        label="Read Article"
        link={link}
        className="article-btn"
      />
    </div>
  );
};
