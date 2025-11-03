import type { DocumentNode } from "./types";

/**
 * Root folder that contains top-level folders and files
 * Only for demo
 * Will be replaced when backend is ready
 * Id will be automatically when backend is ready
 */
export const ROOT: DocumentNode = {
  id: "root",
  name: "HR Documents",
  type: "folder",
  children: [
    {
      id: "new-hire",
      name: "New Hire Resources",
      type: "folder",
      children: [
        {
          id: "checklists",
          name: "Onboarding Checklists",
          type: "folder",
          children: [
            {
              id: "welcome-packet",
              name: "WelcomePacket.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
            {
              id: "orientation-agenda",
              name: "OrientationAgenda.docx",
              type: "item",
              url: "/testfiles/testworddoc.docx",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          ],
        },
        {
          id: "payroll-benefits",
          name: "Payroll & Benefits",
          type: "folder",
          children: [
            {
              id: "direct-deposit",
              name: "DirectDepositForm.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
            {
              id: "tax-overview",
              name: "YearEndTaxOverview.mp4",
              type: "item",
              url: "/testfiles/testvideo.mp4",
              mimeType: "video/mp4",
            },
          ],
        },
      ],
    },
    {
      id: "benefits",
      name: "Benefits",
      type: "folder",
      children: [
        {
          id: "medical",
          name: "Medical",
          type: "folder",
          children: [
            {
              id: "medical-guide",
              name: "MedicalPlanGuide.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
            {
              id: "provider-directory",
              name: "ProviderDirectory.png",
              type: "item",
              url: "/testfiles/testpic.png",
              mimeType: "image/png",
            },
          ],
        },
        {
          id: "retirement",
          name: "Retirement",
          type: "folder",
          children: [
            {
              id: "retirement-overview",
              name: "RetirementOverview.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    },
    {
      id: "policies",
      name: "Policies & Compliance",
      type: "folder",
      children: [
        {
          id: "handbook",
          name: "EmployeeHandbook.pdf",
          type: "item",
          url: "/testfiles/testpdf.pdf",
          mimeType: "application/pdf",
        },
        {
          id: "code-of-conduct",
          name: "CodeOfConduct.pdf",
          type: "item",
          url: "/testfiles/testpdf.pdf",
          mimeType: "application/pdf",
        },
        {
          id: "safety-training",
          name: "Safety Training",
          type: "folder",
          children: [
            {
              id: "fire-safety",
              name: "FireSafetyChecklist.pdf",
              type: "item",
              url: "/testfiles/testpdf.pdf",
              mimeType: "application/pdf",
            },
            {
              id: "evacuation-video",
              name: "EvacuationProcedure.mp4",
              type: "item",
              url: "/testfiles/testvideo.mp4",
              mimeType: "video/mp4",
            },
          ],
        },
      ],
    },
  ],
};
