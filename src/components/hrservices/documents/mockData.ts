import type { DocumentNode } from "./types";

/**
 * Root folder that contains top-level folders and files
 * Only for demo
 * Will be replaced when backend is ready
 * Id will be automatically when backend is ready
 */
export const ROOT: DocumentNode = {
  id: "root",
  name: "Role Information",
  type: "folder",
  children: [
    {
      id: "f1",
      name: "folder 1",
      type: "folder",
      children: [
        {
          id: "f1-1",
          name: "folder 1-1",
          type: "folder",
          children: [
            {
              id: "i1-1-1",
              name: "testpdf.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
            {
              id: "f1-1-1",
              name: "folder 1-1-1",
              type: "folder",
              children: [
                {
                  id: "i1-1-1",
                  name: "testworddoc.docx",
                  type: "item",
                  url: "/testfiles/testworddoc.docx",
                  mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
              ],
            },
          ],
        },
        {
          id: "i1-2",
          name: "testpic.png",
          type: "item",
          url: "/testfiles/testpic.png",
          mimeType: "image/png",
        },
        {
          id: "i1-3",
          name: "testvideo.mp4",
          type: "item",
          url: "/testfiles/testvideo.mp4",
          mimeType: "video/mp4",
        },
      ],
    },
    {
      id: "f2",
      name: "folder 2",
      type: "folder",
      children: [],
    },
  ],
};
