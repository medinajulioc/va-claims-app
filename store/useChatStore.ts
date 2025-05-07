import { ChatItemProps } from "@/app/dashboard/(auth)/apps/chat/types";
import { create, StateCreator } from "zustand";

interface UseChatStore {
  selectedChat: ChatItemProps | null;
  showProfileSheet: boolean;
  setSelectedChat: (chat: ChatItemProps | null) => void;
  toggleProfileSheet: (value: boolean) => void;
}

const chatStore: StateCreator<UseChatStore> = (set) => ({
  selectedChat: null,
  showProfileSheet: false,
  setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
  toggleProfileSheet: (value) => set({ showProfileSheet: value })
});

const useChatStore = create(chatStore);

export default useChatStore;
