import type { DocumentNode } from "./types";

/**
 * Root folder that contains top-level folders and files
 * Only for demo
 * Will be replaced when backend is ready
 */
export const ROOT: DocumentNode = {
  id: "root",
  name: "Role Information",
  type: "folder",
  children: [
    {
      id: "f1",
      name: "Onboarding",
      type: "folder",
      children: [
        {
          id: "f1-1",
          name: "Policies",
          type: "folder",
          children: [
            { id: "pol-1", name: "CodeOfConduct.pdf", type: "file" },
            { id: "pol-2", name: "SecurityGuide.pdf", type: "file" },
          ],
        },
        { id: "f1-r1", name: "Schedule.pdf", type: "file" },
      ],
    },
    {
      id: "f2",
      name: "Benefits",
      type: "folder",
      children: [
        { id: "ben-1", name: "Medical.pdf", type: "file" },
        { id: "ben-2", name: "Dental.pdf", type: "file" },
      ],
    },
    {
      id: "f3",
      name: "Performance",
      type: "folder",
      children: [{ id: "perf-1", name: "2024-Review.pdf", type: "file" }],
    },
    { id: "gen-1", name: "EmployeeHandbook.pdf", type: "file" },
    { id: "gen-2", name: "OrgChart.pdf", type: "file" },
  ],
};
