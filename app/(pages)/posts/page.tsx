import React from "react";
import { NotionAPI } from "notion-client";
import env from "@/config/env.json";
import "react-notion-x/src/styles.css";

const notion = new NotionAPI();

const Posts = async () => {
  const recordMap = await notion.getPage(env.posts_notion_id);

  return (
    <div className="posts-page">
      <div className="posts-container"></div>
    </div>
  );
};

export default Posts;
