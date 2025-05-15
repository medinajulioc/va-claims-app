"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CreatePostModal } from "./CreatePostModal";

interface CreatePostContextType {
  openCreatePostModal: (communityId?: string) => void;
  closeCreatePostModal: () => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export function useCreatePostModal() {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error("useCreatePostModal must be used within a CreatePostProvider");
  }
  return context;
}

interface CreatePostProviderProps {
  children: ReactNode;
}

export function CreatePostProvider({ children }: CreatePostProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>(undefined);

  const openCreatePostModal = (communityId?: string) => {
    setSelectedCommunityId(communityId);
    setIsOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsOpen(false);
  };

  return (
    <CreatePostContext.Provider value={{ openCreatePostModal, closeCreatePostModal }}>
      {children}
      <CreatePostModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        defaultCommunityId={selectedCommunityId} 
      />
    </CreatePostContext.Provider>
  );
} 