import { faCalendarDays, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
export default function SingleBlog({ post }) {
  return (

    <div className="th-blog blog-single has-post-thumbnail">
      <div className="blog-img">
        <Link href={`/blog/${post.slug}`}>
          <img src={post.image} alt="Blog Image" />
        </Link>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <Link className="author" href={`/blog/${post.slug}`}>
            <i>
              <FontAwesomeIcon icon={faUser} />
            </i>
            by Tripogram
          </Link>
          <Link href={`/blog/${post.slug}`}>
            <i className="fa-solid fa-calendar-days">
              <FontAwesomeIcon icon={faCalendarDays} />
            </i>
            {post.created_at}
          </Link>
        </div>
        <h2 className="blog-title">
          <Link href={`/blog/${post.slug}`}>{post.heading}</Link>
        </h2>
        <p className="blog-text">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="th-btn style4 th-icon">
          Read More
        </Link>
      </div>
    </div>
  );
}
