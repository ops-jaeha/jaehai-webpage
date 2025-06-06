import { NotionAPI } from "notion-client";
import env from "@/config/env.json";
import ResumeWrapper from "@/components/ResumeNotionPage";

const notion = new NotionAPI();

const Resume = async () => {
  const recordMap = await notion.getPage(env.resume_notion_id);

  return (
    <div className="resume-page">
      <div className="resume-container">
        <ResumeWrapper recordMap={recordMap} />
      </div>
    </div>
  );
};

export default Resume;
