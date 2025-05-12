import { create, StateCreator } from "zustand";
import {
  File,
  FileFilterOptions,
  SortOption,
  FileType,
  FileStatus,
  Category,
  Tag,
  Annotation,
  DocumentQuality
} from "@/types/file-manager";
import { mockFiles } from "@/lib/mock/file-data";
import { predefinedCategories, predefinedTags } from "@/lib/mock/file-categories";

interface FileManagerState {
  // Files
  files: File[];
  selectedFileId: string | null;
  fileUploadProgress: Record<string, number>;

  // Categories and Tags
  categories: Category[];
  tags: Tag[];

  // Filtering and Sorting
  filterOptions: FileFilterOptions;
  sortOption: SortOption;
  searchQuery: string;

  // UI State
  isUploadDialogOpen: boolean;
  isPreviewDialogOpen: boolean;
  isCategoryDialogOpen: boolean;

  // Document Preview State
  currentPage: number;
  zoom: number;
  rotation: number;
  annotationMode: "none" | "highlight" | "note" | "rectangle" | "underline";
  annotationColor: string;

  // Initialization
  initializeStore: (data: { files?: File[]; categories?: Category[]; tags?: Tag[] }) => void;

  // Actions - Files
  addFile: (file: File) => void;
  updateFile: (fileId: string, updates: Partial<File>) => void;
  deleteFile: (fileId: string) => void;
  selectFile: (fileId: string | null) => void;
  setFileUploadProgress: (fileId: string, progress: number) => void;

  // Actions - Categories and Tags
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  addTag: (tag: Tag) => void;
  updateTag: (tagId: string, updates: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;

  // Actions - File Categorization
  assignCategory: (fileId: string, categoryId: string) => void;
  removeCategory: (fileId: string, categoryId: string) => void;
  assignTag: (fileId: string, tagId: string) => void;
  removeTag: (fileId: string, tagId: string) => void;
  toggleFileStarred: (fileId: string) => void;

  // Actions - Filtering and Sorting
  setFilterOptions: (options: Partial<FileFilterOptions>) => void;
  setSortOption: (option: SortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;

  // Actions - UI State
  toggleUploadDialog: (isOpen?: boolean) => void;
  togglePreviewDialog: (isOpen?: boolean) => void;
  toggleCategoryDialog: (isOpen?: boolean) => void;

  // Actions - Document Preview
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setRotation: (rotation: number) => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  resetView: () => void;
  setAnnotationMode: (mode: "none" | "highlight" | "note" | "rectangle" | "underline") => void;
  setAnnotationColor: (color: string) => void;
  addAnnotation: (fileId: string, annotation: Omit<Annotation, "id" | "createdAt">) => void;
  updateAnnotation: (fileId: string, annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (fileId: string, annotationId: string) => void;

  // Computed
  getFilteredFiles: () => File[];
  getFilesByCategory: (categoryId: string) => File[];
  getFilesByTag: (tagId: string) => File[];
  getSelectedFile: () => File | null;
}

const fileManagerStore: StateCreator<FileManagerState> = (set, get) => ({
  // Initial State
  files: mockFiles,
  selectedFileId: null,
  fileUploadProgress: {},
  categories: predefinedCategories,
  tags: predefinedTags,
  filterOptions: {},
  sortOption: { field: "uploadDate", direction: "desc" },
  searchQuery: "",
  isUploadDialogOpen: false,
  isPreviewDialogOpen: false,
  isCategoryDialogOpen: false,

  // Document Preview Initial State
  currentPage: 1,
  zoom: 1,
  rotation: 0,
  annotationMode: "none" as const,
  annotationColor: "#FFEB3B", // Default yellow

  // Initialization
  initializeStore: (data) => {
    set((state) => ({
      files: data.files || state.files,
      categories: data.categories || state.categories,
      tags: data.tags || state.tags
    }));
  },

  // Actions - Files
  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file]
    })),

  updateFile: (fileId, updates) =>
    set((state) => ({
      files: state.files.map((file) => (file.id === fileId ? { ...file, ...updates } : file))
    })),

  deleteFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId),
      selectedFileId: state.selectedFileId === fileId ? null : state.selectedFileId
    })),

  selectFile: (fileId) =>
    set({
      selectedFileId: fileId,
      currentPage: 1,
      zoom: 1,
      rotation: 0
    }),

  setFileUploadProgress: (fileId, progress) =>
    set((state) => ({
      fileUploadProgress: { ...state.fileUploadProgress, [fileId]: progress }
    })),

  // Actions - Categories and Tags
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category]
    })),

  updateCategory: (categoryId, updates) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId ? { ...category, ...updates } : category
      )
    })),

  deleteCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId),
      files: state.files.map((file) => ({
        ...file,
        categoryIds: file.categoryIds.filter((id) => id !== categoryId)
      }))
    })),

  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag]
    })),

  updateTag: (tagId, updates) =>
    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === tagId ? { ...tag, ...updates } : tag))
    })),

  deleteTag: (tagId) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== tagId),
      files: state.files.map((file) => ({
        ...file,
        tagIds: file.tagIds.filter((id) => id !== tagId)
      }))
    })),

  // Actions - File Categorization
  assignCategory: (fileId, categoryId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId && !file.categoryIds.includes(categoryId)
          ? { ...file, categoryIds: [...file.categoryIds, categoryId] }
          : file
      )
    })),

  removeCategory: (fileId, categoryId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId
          ? { ...file, categoryIds: file.categoryIds.filter((id) => id !== categoryId) }
          : file
      )
    })),

  assignTag: (fileId, tagId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId && !file.tagIds.includes(tagId)
          ? { ...file, tagIds: [...file.tagIds, tagId] }
          : file
      )
    })),

  removeTag: (fileId, tagId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, tagIds: file.tagIds.filter((id) => id !== tagId) } : file
      )
    })),

  toggleFileStarred: (fileId) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, starred: !file.starred } : file
      )
    })),

  // Actions - Filtering and Sorting
  setFilterOptions: (options) =>
    set((state) => ({
      filterOptions: { ...state.filterOptions, ...options }
    })),

  setSortOption: (option) => set({ sortOption: option }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () =>
    set({
      filterOptions: {},
      searchQuery: ""
    }),

  // Actions - UI State
  toggleUploadDialog: (isOpen) =>
    set((state) => ({
      isUploadDialogOpen: isOpen !== undefined ? isOpen : !state.isUploadDialogOpen
    })),

  togglePreviewDialog: (isOpen) =>
    set((state) => ({
      isPreviewDialogOpen: isOpen !== undefined ? isOpen : !state.isPreviewDialogOpen
    })),

  toggleCategoryDialog: (isOpen) =>
    set((state) => ({
      isCategoryDialogOpen: isOpen !== undefined ? isOpen : !state.isCategoryDialogOpen
    })),

  // Actions - Document Preview
  setCurrentPage: (page) => {
    const file = get().getSelectedFile();
    if (!file || !file.pageCount) return;

    const newPage = Math.max(1, Math.min(page, file.pageCount));
    set({ currentPage: newPage });

    get().updateFile(file.id, { currentPage: newPage });
  },

  nextPage: () => {
    const { currentPage } = get();
    get().setCurrentPage(currentPage + 1);
  },

  prevPage: () => {
    const { currentPage } = get();
    get().setCurrentPage(currentPage - 1);
  },

  setZoom: (zoom) => {
    const newZoom = Math.max(0.25, Math.min(zoom, 5)); // Limit zoom between 25% and 500%
    set({ zoom: newZoom });

    const file = get().getSelectedFile();
    if (file) {
      get().updateFile(file.id, { zoom: newZoom });
    }
  },

  zoomIn: () => {
    const { zoom } = get();
    get().setZoom(zoom + 0.25);
  },

  zoomOut: () => {
    const { zoom } = get();
    get().setZoom(zoom - 0.25);
  },

  setRotation: (rotation) => {
    // Normalize rotation to 0, 90, 180, or 270 degrees
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    set({ rotation: normalizedRotation });

    const file = get().getSelectedFile();
    if (file) {
      get().updateFile(file.id, { rotation: normalizedRotation });
    }
  },

  rotateClockwise: () => {
    const { rotation } = get();
    get().setRotation(rotation + 90);
  },

  rotateCounterClockwise: () => {
    const { rotation } = get();
    get().setRotation(rotation - 90);
  },

  resetView: () => {
    set({
      zoom: 1,
      rotation: 0,
      currentPage: 1
    });

    const file = get().getSelectedFile();
    if (file) {
      get().updateFile(file.id, {
        zoom: 1,
        rotation: 0,
        currentPage: 1
      });
    }
  },

  setAnnotationMode: (mode) => {
    set({ annotationMode: mode });
  },

  setAnnotationColor: (color) => {
    set({ annotationColor: color });
  },

  addAnnotation: (fileId, annotation) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation-${Date.now()}`,
      createdAt: new Date()
    };

    set((state) => ({
      files: state.files.map((file) => {
        if (file.id === fileId) {
          const annotations = file.annotations || [];
          return {
            ...file,
            annotations: [...annotations, newAnnotation]
          };
        }
        return file;
      })
    }));
  },

  updateAnnotation: (fileId, annotationId, updates) => {
    set((state) => ({
      files: state.files.map((file) => {
        if (file.id === fileId && file.annotations) {
          return {
            ...file,
            annotations: file.annotations.map((annotation) =>
              annotation.id === annotationId
                ? { ...annotation, ...updates, updatedAt: new Date() }
                : annotation
            )
          };
        }
        return file;
      })
    }));
  },

  deleteAnnotation: (fileId, annotationId) => {
    set((state) => ({
      files: state.files.map((file) => {
        if (file.id === fileId && file.annotations) {
          return {
            ...file,
            annotations: file.annotations.filter((annotation) => annotation.id !== annotationId)
          };
        }
        return file;
      })
    }));
  },

  // Computed
  getFilteredFiles: () => {
    const { files, filterOptions, sortOption, searchQuery } = get();

    // Filter files based on current filter options and search query
    let filtered = [...files];

    // Apply filters for file types
    if (filterOptions.types && filterOptions.types.length > 0) {
      filtered = filtered.filter((file) => filterOptions.types?.includes(file.type));
    }

    // Apply filters for categories
    if (filterOptions.categories && filterOptions.categories.length > 0) {
      filtered = filtered.filter((file) =>
        file.categoryIds.some((id) => filterOptions.categories?.includes(id))
      );
    }

    // Apply filters for tags
    if (filterOptions.tags && filterOptions.tags.length > 0) {
      filtered = filtered.filter((file) =>
        file.tagIds.some((id) => filterOptions.tags?.includes(id))
      );
    }

    // Apply filter for starred files
    if (filterOptions.starred) {
      filtered = filtered.filter((file) => file.starred);
    }

    // Apply filter for uncategorized files
    if (filterOptions.uncategorized) {
      filtered = filtered.filter((file) => file.categoryIds.length === 0);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(query) || file.content?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = sortOption;
      const modifier = direction === "asc" ? 1 : -1;

      switch (field) {
        case "name":
          return a.name.localeCompare(b.name) * modifier;
        case "size":
          return (a.size - b.size) * modifier;
        case "type":
          return a.type.localeCompare(b.type) * modifier;
        case "uploadDate":
          return (new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()) * modifier;
        default:
          return 0;
      }
    });

    return filtered;
  },

  getFilesByCategory: (categoryId) => {
    return get().files.filter((file) => file.categoryIds.includes(categoryId));
  },

  getFilesByTag: (tagId) => {
    return get().files.filter((file) => file.tagIds.includes(tagId));
  },

  getSelectedFile: () => {
    const { files, selectedFileId } = get();
    return selectedFileId ? files.find((file) => file.id === selectedFileId) || null : null;
  }
});

const useFileManagerStore = create(fileManagerStore);

export default useFileManagerStore;
