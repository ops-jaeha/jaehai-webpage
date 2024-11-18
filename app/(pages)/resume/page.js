import React from "react";
import { NotionAPI } from "notion-client";
import env from "@/config/env.json";
import ResumeRenderer from "@/components/ResumeRenderer";
import "@/app/styles/Resume.css";

const notion = new NotionAPI();

const Resume = async () => {
  const recordMap = await notion.getPage(env.resume_notion_id);

  return (
    <div className="resume-page">
      <div className="resume-container">
        <ResumeRenderer recordMap={recordMap} />
      </div>
    </div>
  );
};

export default Resume;
