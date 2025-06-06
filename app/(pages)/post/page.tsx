import React from "react";
import { NotionAPI } from "notion-client";
import env from "@/config/env.json";
import "react-notion-x/src/styles.css";

const notion = new NotionAPI();

const Post = async () => {
  const recordMap = await notion.getPage(env.post_notion_id);

  return (
    <div className="post-page">
      <div className="post-container"></div>
    </div>
  );
};

export default Post;
