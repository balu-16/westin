import { findOfficialArticle, type ArticleBlock } from "./officialArticles";

/**
 * The full original article text, styled in our theme. Loaded on demand by
 * /blog/<slug> so the ~29k words stay out of the Home bundle.
 *
 * The copy is the college's own published text and is reproduced verbatim,
 * including the articles that name other colleges.
 */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.t) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "h4":
      return <h4>{block.text}</h4>;
    case "h5":
    case "h6":
      return <h5>{block.text}</h5>;
    case "li":
      return <li>{block.text}</li>;
    case "blockquote":
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p>{block.text}</p>;
  }
}

export function OfficialArticleBody({ slug }: { slug: string }) {
  const article = findOfficialArticle(slug);
  if (!article) {
    return (
      <p>
        This article is not available in the migrated archive. The original text
        is on the Westin College website.
      </p>
    );
  }
  // Group consecutive list items so the markup is valid.
  const nodes: React.ReactNode[] = [];
  let run: ArticleBlock[] = [];
  const flush = (key: string) => {
    if (!run.length) return;
    nodes.push(
      <ul key={key}>
        {run.map((item, index) => (
          <li key={`${item.text.slice(0, 24)}-${index}`}>{item.text}</li>
        ))}
      </ul>,
    );
    run = [];
  };
  article.body.forEach((block, index) => {
    if (block.t === "li") {
      run.push(block);
      return;
    }
    flush(`ul-${index}`);
    nodes.push(<Block key={`b-${index}`} block={block} />);
  });
  flush("ul-end");

  return <div className="sk-article-body">{nodes}</div>;
}

export default OfficialArticleBody;
