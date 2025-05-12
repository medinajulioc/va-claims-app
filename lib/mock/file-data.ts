import { File, FileStatus, FileType, DocumentQuality, Annotation } from "@/types/file-manager";

/**
 * Mock annotations for testing
 */
const mockPdfAnnotations: Annotation[] = [
  {
    id: "anno-1",
    type: "highlight",
    pageNumber: 1,
    color: "#FFEB3B",
    position: {
      x: 20,
      y: 30,
      width: 60,
      height: 5
    },
    createdAt: new Date(2024, 3, 20)
  },
  {
    id: "anno-2",
    type: "note",
    pageNumber: 1,
    content: "Important section for claim",
    color: "#4CAF50",
    position: {
      x: 70,
      y: 50
    },
    createdAt: new Date(2024, 3, 21)
  },
  {
    id: "anno-3",
    type: "rectangle",
    pageNumber: 2,
    color: "#2196F3",
    position: {
      x: 30,
      y: 40,
      width: 40,
      height: 20
    },
    createdAt: new Date(2024, 3, 22)
  },
  {
    id: "anno-4",
    type: "underline",
    pageNumber: 3,
    color: "#F44336",
    position: {
      x: 15,
      y: 60,
      width: 70
    },
    createdAt: new Date(2024, 3, 23)
  }
];

const mockImageAnnotations: Annotation[] = [
  {
    id: "img-anno-1",
    type: "highlight",
    pageNumber: 1,
    color: "#FFEB3B",
    position: {
      x: 35,
      y: 45,
      width: 25,
      height: 10
    },
    createdAt: new Date(2024, 3, 20)
  },
  {
    id: "img-anno-2",
    type: "note",
    pageNumber: 1,
    content: "Evidence of injury",
    color: "#F44336",
    position: {
      x: 55,
      y: 65
    },
    createdAt: new Date(2024, 3, 21)
  }
];

/**
 * Mock file data for testing the file manager
 */
export const mockFiles: File[] = [
  {
    id: "file-1",
    name: "VA-Form-21-526EZ.pdf",
    type: FileType.PDF,
    size: 2500000,
    uploadDate: new Date(2024, 3, 15),
    lastModified: new Date(2024, 3, 15),
    status: FileStatus.COMPLETE,
    url: "/mock/files/VA-Form-21-526EZ.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["va-forms"],
    tagIds: ["submitted"],
    content: "Application for Disability Compensation and Related Compensation Benefits...",
    starred: true,
    pageCount: 8,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.HIGH,
    previewPages: [
      "/mock/pages/VA-Form-21-526EZ-page1.png",
      "/mock/pages/VA-Form-21-526EZ-page2.png"
    ],
    annotations: mockPdfAnnotations,
    rotation: 0,
    zoom: 1
  },
  {
    id: "file-2",
    name: "medical-records-2023.pdf",
    type: FileType.PDF,
    size: 5600000,
    uploadDate: new Date(2024, 3, 10),
    lastModified: new Date(2024, 3, 12),
    status: FileStatus.COMPLETE,
    url: "/mock/files/medical-records-2023.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["medical-records"],
    tagIds: ["important"],
    content: "Patient medical records from VA Hospital. Diagnosis: PTSD, Chronic back pain...",
    pageCount: 24,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.MEDIUM,
    annotations: [
      {
        id: "anno-5",
        type: "highlight",
        pageNumber: 4,
        color: "#FFEB3B",
        position: {
          x: 25,
          y: 35,
          width: 50,
          height: 5
        },
        createdAt: new Date(2024, 3, 11)
      }
    ],
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-3",
    name: "dd214.pdf",
    type: FileType.PDF,
    size: 1200000,
    uploadDate: new Date(2024, 2, 25),
    lastModified: new Date(2024, 2, 25),
    status: FileStatus.COMPLETE,
    url: "/mock/files/dd214.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["service-records"],
    tagIds: ["important", "submitted"],
    content: "Certificate of Release or Discharge from Active Duty...",
    pageCount: 1,
    currentPage: 1,
    dimensions: {
      width: 612,
      height: 792
    },
    documentQuality: DocumentQuality.HIGH,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: true
  },
  {
    id: "file-4",
    name: "knee-xray.jpg",
    type: FileType.JPG,
    size: 3800000,
    uploadDate: new Date(2024, 2, 20),
    lastModified: new Date(2024, 2, 20),
    status: FileStatus.COMPLETE,
    url: "/mock/files/knee-xray.jpg",
    thumbnailUrl: "/mock/files/knee-xray.jpg",
    categoryIds: ["medical-records", "supporting-evidence"],
    tagIds: [],
    content: "X-ray image of right knee showing degenerative joint disease...",
    dimensions: {
      width: 1200,
      height: 900
    },
    documentQuality: DocumentQuality.MEDIUM,
    annotations: mockImageAnnotations,
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-5",
    name: "personal-statement.pdf",
    type: FileType.PDF,
    size: 980000,
    uploadDate: new Date(2024, 2, 15),
    lastModified: new Date(2024, 2, 16),
    status: FileStatus.COMPLETE,
    url: "/mock/files/personal-statement.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["personal-statements"],
    tagIds: ["submitted"],
    content:
      "I am writing this statement to describe the events that occurred during my service...",
    pageCount: 3,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.HIGH,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-6",
    name: "buddy-statement.pdf",
    type: FileType.PDF,
    size: 850000,
    uploadDate: new Date(2024, 2, 10),
    lastModified: new Date(2024, 2, 10),
    status: FileStatus.COMPLETE,
    url: "/mock/files/buddy-statement.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["supporting-evidence", "personal-statements"],
    tagIds: [],
    content: "I served with John Doe in Afghanistan and can confirm the incident that occurred...",
    pageCount: 2,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.MEDIUM,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-7",
    name: "va-decision-letter.pdf",
    type: FileType.PDF,
    size: 1500000,
    uploadDate: new Date(2024, 1, 28),
    lastModified: new Date(2024, 1, 28),
    status: FileStatus.COMPLETE,
    url: "/mock/files/va-decision-letter.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["decision-letters"],
    tagIds: ["important"],
    content:
      "Department of Veterans Affairs Decision Letter. We have made a decision on your claim...",
    pageCount: 5,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.HIGH,
    annotations: [
      {
        id: "anno-6",
        type: "highlight",
        pageNumber: 2,
        color: "#F44336",
        position: {
          x: 30,
          y: 50,
          width: 60,
          height: 8
        },
        createdAt: new Date(2024, 2, 5)
      }
    ],
    rotation: 0,
    zoom: 1,
    starred: true
  },
  {
    id: "file-8",
    name: "appeal-form.pdf",
    type: FileType.PDF,
    size: 1100000,
    uploadDate: new Date(2024, 1, 15),
    lastModified: new Date(2024, 1, 15),
    status: FileStatus.COMPLETE,
    url: "/mock/files/appeal-form.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["appeals-documents", "va-forms"],
    tagIds: ["needs-review"],
    content: "Notice of Disagreement with VA Decision...",
    pageCount: 4,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.MEDIUM,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-9",
    name: "therapy-notes.pdf",
    type: FileType.PDF,
    size: 2200000,
    uploadDate: new Date(2024, 1, 10),
    lastModified: new Date(2024, 1, 12),
    status: FileStatus.COMPLETE,
    url: "/mock/files/therapy-notes.pdf",
    thumbnailUrl: "/mock/thumbnails/pdf-thumbnail.png",
    categoryIds: ["medical-records"],
    tagIds: ["incomplete"],
    content: "Therapy session notes for PTSD treatment...",
    pageCount: 12,
    currentPage: 1,
    dimensions: {
      width: 595,
      height: 842
    },
    documentQuality: DocumentQuality.LOW,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: false
  },
  {
    id: "file-10",
    name: "deployment-orders.png",
    type: FileType.PNG,
    size: 1800000,
    uploadDate: new Date(2024, 0, 20),
    lastModified: new Date(2024, 0, 20),
    status: FileStatus.COMPLETE,
    url: "/mock/files/deployment-orders.png",
    thumbnailUrl: "/mock/files/deployment-orders.png",
    categoryIds: ["service-records"],
    tagIds: [],
    content: "Orders to report for deployment to Afghanistan...",
    dimensions: {
      width: 1000,
      height: 1200
    },
    documentQuality: DocumentQuality.HIGH,
    annotations: [],
    rotation: 0,
    zoom: 1,
    starred: false
  }
];

/**
 * Get files by category ID
 */
export const getFilesByCategory = (categoryId: string): File[] => {
  return mockFiles.filter((file) => file.categoryIds.includes(categoryId));
};

/**
 * Get files by tag ID
 */
export const getFilesByTag = (tagId: string): File[] => {
  return mockFiles.filter((file) => file.tagIds.includes(tagId));
};

/**
 * Search files by content or name
 */
export const searchFiles = (query: string): File[] => {
  const lowerQuery = query.toLowerCase();
  return mockFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(lowerQuery) ||
      (file.content && file.content.toLowerCase().includes(lowerQuery))
  );
};
