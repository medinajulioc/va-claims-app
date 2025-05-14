import { atom, selector } from "recoil";
import { Community, Post, Comment, User, Vote } from "./types";
import { v4 as uuidv4 } from "uuid";

// Mock data for communities
export const communitiesState = atom<Community[]>({
  key: "communitiesState",
  default: [
    {
      id: "1",
      name: "General Discussion",
      description: "A place for general discussions about VA claims and benefits.",
      members: 1250,
      createdAt: new Date("2023-01-15"),
      imageUrl: "/images/community/general.png",
      tags: ["general", "discussion", "benefits"]
    },
    {
      id: "2",
      name: "Disability Claims",
      description: "Discuss VA disability claims, ratings, and appeals.",
      members: 876,
      createdAt: new Date("2023-02-20"),
      imageUrl: "/images/community/disability.png",
      tags: ["disability", "claims", "ratings"]
    },
    {
      id: "3",
      name: "Mental Health Support",
      description: "Support and resources for veterans dealing with mental health issues.",
      members: 789,
      createdAt: new Date("2023-05-12"),
      imageUrl: "/images/community/mental-health.png",
      tags: ["mental health", "support", "resources"]
    },
    {
      id: "4",
      name: "Healthcare Benefits",
      description: "Information about VA healthcare services and eligibility.",
      members: 654,
      createdAt: new Date("2023-03-10"),
      imageUrl: "/images/community/healthcare.png",
      tags: ["healthcare", "benefits", "services"]
    },
    {
      id: "5",
      name: "Education & GI Bill",
      description: "Resources and discussions about educational benefits.",
      members: 432,
      createdAt: new Date("2023-04-05"),
      imageUrl: "/images/community/education.png",
      tags: ["education", "gi bill", "benefits"]
    }
  ]
});

// Mock data for posts
export const postsState = atom<Post[]>({
  key: "postsState",
  default: [
    {
      id: "1",
      communityId: "1",
      title: "Welcome to the VA Claims Community",
      content:
        "Welcome to our community dedicated to helping veterans navigate their VA benefits and claims process. This is a safe space to ask questions, share experiences, and support one another through the claims journey.",
      userId: "u1",
      username: "admin",
      createdAt: new Date("2023-01-16"),
      voteStatus: 42,
      commentCount: 12,
      imageUrl: "/images/community/welcome-banner.jpg",
      tags: ["welcome", "rules", "introduction"]
    },
    {
      id: "2",
      communityId: "2",
      title: "How I Got My PTSD Rating Increased from 30% to 70%",
      content:
        "After years of struggling with my initial 30% PTSD rating, I finally got it increased to 70%. I wanted to share my experience and the documentation that made the difference. The key was getting a private DBQ from a psychologist who thoroughly documented all my symptoms according to the rating criteria. I also submitted personal statements from family members describing how my condition affects daily life.",
      userId: "u3",
      username: "veteran_2020",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      voteStatus: 89,
      commentCount: 24,
      imageUrl: "/images/community/rating-document.jpg",
      tags: ["success story", "ptsd", "rating increase", "dbq"]
    },
    {
      id: "3",
      communityId: "3",
      title: "Free Mental Health Resources Every Veteran Should Know About",
      content:
        "Beyond the VA's standard mental health services, there are several free resources that have helped me tremendously. The Veterans Crisis Line (1-800-273-8255) is available 24/7. The Vet Centers offer free counseling. Give An Hour provides free therapy sessions. The VA's Mindfulness Coach app is surprisingly effective for daily practice. I've compiled a comprehensive list with contact information and eligibility requirements.",
      userId: "u5",
      username: "wellness_advocate",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
      voteStatus: 156,
      commentCount: 31,
      imageUrl: "/images/community/mental-health-resources.jpg",
      tags: ["mental health", "resources", "therapy", "support"]
    },
    {
      id: "4",
      communityId: "2",
      title: "New VA Disability Calculator Tool - Check Your Combined Rating",
      content:
        "I just discovered the new VA disability calculator on this site and it's incredibly helpful for understanding how the VA combines multiple ratings. Many veterans don't realize that ratings aren't simply added together. This calculator uses the correct formula and even shows you the bilateral factor when applicable. It helped me verify that my combined rating is correct.",
      userId: "u2",
      username: "claims_expert",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      voteStatus: 67,
      commentCount: 15,
      imageUrl: "/images/community/disability-calculator.jpg",
      tags: ["calculator", "combined rating", "tool", "disability"]
    },
    {
      id: "5",
      communityId: "4",
      title: "VA Healthcare Priority Groups Explained",
      content:
        "Understanding your VA healthcare priority group is essential for knowing what benefits you qualify for and what costs you might incur. There are 8 priority groups, with Group 1 having the highest priority. Your group is determined by factors like service-connected disability rating, income, and special eligibility factors. I've created a simple chart explaining each group and the benefits associated with them.",
      userId: "u4",
      username: "healthcare_advisor",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
      voteStatus: 103,
      commentCount: 27,
      imageUrl: "/images/community/priority-groups.jpg",
      tags: ["healthcare", "priority groups", "benefits", "eligibility"]
    },
    {
      id: "6",
      communityId: "5",
      title: "GI Bill Housing Allowance Rates Updated for 2023",
      content:
        "The VA has just updated the Post-9/11 GI Bill housing allowance rates for 2023. The rates are based on the military Basic Allowance for Housing (BAH) for an E-5 with dependents. The national average increased by about 5.1%, but the changes vary significantly by location. Some areas saw increases of over 10%, while others remained nearly the same. Check the updated rates for your school's ZIP code to plan your budget accordingly.",
      userId: "u7",
      username: "edu_planner",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      voteStatus: 78,
      commentCount: 19,
      imageUrl: "/images/community/gi-bill-housing.jpg",
      tags: ["gi bill", "housing allowance", "2023", "education benefits"]
    },
    {
      id: "7",
      communityId: "1",
      title: "VA Claims Backlog Update - What to Expect in 2023",
      content:
        "The VA is currently working through a significant claims backlog. According to recent data, the average wait time for initial claims decisions is approximately 4-5 months, with some regional offices experiencing longer delays. The VA has hired additional claims processors and is implementing new technologies to address the backlog. If your claim has been pending for more than 125 days, you can request a status update through your VSO or the VA hotline.",
      userId: "u2",
      username: "claims_expert",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 72 hours ago
      voteStatus: 93,
      commentCount: 42,
      imageUrl: "/images/community/claims-backlog.jpg",
      tags: ["claims", "backlog", "processing times", "updates"]
    },
    {
      id: "8",
      communityId: "2",
      title: "C&P Exam Tips - What I Wish I Knew Before My Exam",
      content:
        "I recently went through several C&P exams and learned some valuable lessons. Be honest about your worst days, not just how you feel at the moment of the exam. Bring a copy of your medical records and claim documents. Consider bringing a witness who can speak to your symptoms. Take notes immediately after the exam about what was discussed. Request a copy of the examiner's report as soon as possible to check for errors. Don't downplay your symptoms out of pride or stoicism - this is about getting the benefits you've earned.",
      userId: "u6",
      username: "perseverance2023",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
      voteStatus: 127,
      commentCount: 35,
      imageUrl: "/images/community/cp-exam.jpg",
      tags: ["c&p exam", "tips", "disability claims", "advice"]
    },
    {
      id: "9",
      communityId: "3",
      title: "PTSD Coping Strategies That Actually Work",
      content:
        "After years of struggling with PTSD, I've found several coping strategies that have genuinely helped. Grounding techniques like the 5-4-3-2-1 method help during flashbacks. Regular exercise, particularly outdoor activities, reduces my overall anxiety. Mindfulness meditation (start with just 5 minutes) has improved my sleep quality. Maintaining a consistent sleep schedule is crucial. Service dogs can be life-changing for those who qualify. Peer support groups provide understanding that even well-meaning family members can't always offer.",
      userId: "u5",
      username: "wellness_advocate",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      voteStatus: 114,
      commentCount: 29,
      imageUrl: "/images/community/ptsd-coping.jpg",
      tags: ["ptsd", "mental health", "coping strategies", "wellness"]
    },
    {
      id: "10",
      communityId: "4",
      title: "Community Care Program Eligibility Expanded",
      content:
        "The VA has expanded eligibility for the Community Care Program, allowing more veterans to receive care from non-VA providers when necessary. You may now qualify if the wait time for a VA appointment exceeds 20 days for primary care or 28 days for specialty care, or if you live more than 30 minutes driving time from a VA primary care provider. This is particularly beneficial for rural veterans who previously had to travel long distances for routine care.",
      userId: "u4",
      username: "healthcare_advisor",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      voteStatus: 86,
      commentCount: 17,
      imageUrl: "/images/community/community-care.jpg",
      tags: ["healthcare", "community care", "eligibility", "rural veterans"]
    }
  ]
});

// Mock data for comments
export const commentsState = atom<Comment[]>({
  key: "commentsState",
  default: [
    {
      id: "c1",
      postId: "1",
      userId: "u2",
      username: "claims_expert",
      content: "Thanks for creating this community! Looking forward to the discussions.",
      createdAt: new Date("2023-01-16T10:30:00"),
      voteStatus: 5
    },
    {
      id: "c2",
      postId: "1",
      userId: "u3",
      username: "veteran_2020",
      content: "Glad to be here. This will be a valuable resource.",
      createdAt: new Date("2023-01-16T11:45:00"),
      voteStatus: 3
    },
    {
      id: "c3",
      postId: "3",
      userId: "u4",
      username: "healthcare_advisor",
      content:
        "This is really helpful information. I'd add that veterans should also keep detailed records of all medical conditions.",
      createdAt: new Date("2023-02-23T09:15:00"),
      voteStatus: 8
    },
    {
      id: "c4",
      postId: "3",
      userId: "u5",
      username: "new_veteran",
      content:
        "As someone new to the VA system, this explanation really helped me understand the process better.",
      createdAt: new Date("2023-02-24T14:20:00"),
      voteStatus: 6
    },
    {
      id: "c5",
      postId: "6",
      userId: "u3",
      username: "veteran_2020",
      content: "Thanks for summarizing these changes. The housing allowance update is significant!",
      createdAt: new Date("2023-06-10T15:45:00"),
      voteStatus: 7
    },
    {
      id: "c6",
      postId: "7",
      userId: "u6",
      username: "perseverance2023",
      content:
        "I've used the peer support program you mentioned and it was life-changing. Highly recommend.",
      createdAt: new Date("2023-06-19T08:30:00"),
      voteStatus: 9
    },
    {
      id: "c7",
      postId: "8",
      userId: "u2",
      username: "claims_expert",
      content:
        "Congratulations! Your persistence paid off. This will inspire others in similar situations.",
      createdAt: new Date("2023-07-05T11:20:00"),
      voteStatus: 12
    },
    {
      id: "c8",
      postId: "2",
      userId: "u4",
      username: "healthcare_advisor",
      content:
        "This is exactly the kind of detailed documentation that makes a difference in ratings. Thanks for sharing your experience!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      voteStatus: 15
    },
    {
      id: "c9",
      postId: "2",
      userId: "u7",
      username: "edu_planner",
      content:
        "Did you use a VSO or attorney for your appeal? I'm considering getting representation for mine.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      voteStatus: 3
    },
    {
      id: "c10",
      postId: "4",
      userId: "u6",
      username: "perseverance2023",
      content:
        "This calculator is so much better than others I've tried. It actually explains how the VA math works!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
      voteStatus: 8
    },
    {
      id: "c11",
      postId: "9",
      userId: "u3",
      username: "veteran_2020",
      content:
        "The grounding techniques you mentioned have been a game-changer for me. I'd also recommend the VA's PTSD Coach app.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      voteStatus: 11
    }
  ]
});

// Mock data for current user
export const currentUserState = atom<User | null>({
  key: "currentUserState",
  default: {
    id: "u1",
    username: "admin",
    email: "admin@example.com",
    imageUrl: `${process.env.ASSETS_URL}/avatars/01.png`,
    joinedCommunities: ["1", "2", "3", "4", "5"]
  }
});

// Mock data for votes
export const votesState = atom<Vote[]>({
  key: "votesState",
  default: []
});

// Selectors for data operations
export const getPostsByCommunityId = selector({
  key: "getPostsByCommunityId",
  get:
    ({ get }) =>
    (communityId: string) => {
      const posts = get(postsState);
      return posts.filter((post) => post.communityId === communityId);
    }
});

export const getCommentsByPostId = selector({
  key: "getCommentsByPostId",
  get:
    ({ get }) =>
    (postId: string) => {
      const comments = get(commentsState);
      return comments.filter((comment) => comment.postId === postId);
    }
});

export const getCommunityById = selector({
  key: "getCommunityById",
  get:
    ({ get }) =>
    (communityId: string) => {
      const communities = get(communitiesState);
      return communities.find((community) => community.id === communityId);
    }
});

export const getPostById = selector({
  key: "getPostById",
  get:
    ({ get }) =>
    (postId: string) => {
      const posts = get(postsState);
      return posts.find((post) => post.id === postId);
    }
});

// Helper functions for manipulating state
export const addCommunityAtom = selector({
  key: "addCommunityAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (community: Omit<Community, "id" | "createdAt" | "members">) => {};
  },
  set: ({ set, get }, newCommunity: any) => {
    const currentCommunities = get(communitiesState);
    const newCommunityWithId = {
      ...newCommunity,
      id: uuidv4(),
      createdAt: new Date(),
      members: 1 // Creator is the first member
    };
    set(communitiesState, [...currentCommunities, newCommunityWithId]);
  }
});

export const addPostAtom = selector({
  key: "addPostAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (post: Omit<Post, "id" | "createdAt" | "voteStatus" | "commentCount">) => {};
  },
  set: ({ set, get }, newPost: any) => {
    const currentPosts = get(postsState);
    const user = get(currentUserState);
    const newPostWithId = {
      ...newPost,
      id: uuidv4(),
      createdAt: new Date(),
      voteStatus: 0,
      commentCount: 0,
      username: user?.username || "anonymous"
    };
    set(postsState, [...currentPosts, newPostWithId]);
  }
});

export const addCommentAtom = selector({
  key: "addCommentAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (comment: Omit<Comment, "id" | "createdAt" | "voteStatus">) => {};
  },
  set: ({ set, get }, newComment: any) => {
    const currentComments = get(commentsState);
    const currentPosts = get(postsState);
    const user = get(currentUserState);

    const newCommentWithId = {
      ...newComment,
      id: uuidv4(),
      createdAt: new Date(),
      voteStatus: 0,
      username: user?.username || "anonymous"
    };

    // Update comment count on the post
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === newComment.postId) {
        return {
          ...post,
          commentCount: post.commentCount + 1
        };
      }
      return post;
    });

    set(commentsState, [...currentComments, newCommentWithId]);
    set(postsState, updatedPosts);
  }
});

export const voteOnPostAtom = selector({
  key: "voteOnPostAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (postId: string, value: number) => {};
  },
  set: ({ set, get }, voteData: any) => {
    const { postId, value } = voteData;
    const currentPosts = get(postsState);
    const currentVotes = get(votesState);
    const user = get(currentUserState);

    if (!user) return; // Must be logged in to vote

    // Check if user already voted on this post
    const existingVote = currentVotes.find(
      (vote) => vote.postId === postId && vote.userId === user.id
    );

    let voteChange = value;

    // If already voted, remove old vote value
    if (existingVote) {
      voteChange = value - existingVote.value;

      // Update existing vote
      const updatedVotes = currentVotes.map((vote) => {
        if (vote.postId === postId && vote.userId === user.id) {
          return { ...vote, value };
        }
        return vote;
      });

      set(votesState, updatedVotes);
    } else {
      // Add new vote
      const newVote = {
        id: uuidv4(),
        postId,
        userId: user.id,
        value
      };

      set(votesState, [...currentVotes, newVote]);
    }

    // Update post vote status
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          voteStatus: post.voteStatus + voteChange
        };
      }
      return post;
    });

    set(postsState, updatedPosts);
  }
});

export const voteOnCommentAtom = selector({
  key: "voteOnCommentAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (commentId: string, value: number) => {};
  },
  set: ({ set, get }, voteData: any) => {
    const { commentId, value } = voteData;
    const currentComments = get(commentsState);
    const currentVotes = get(votesState);
    const user = get(currentUserState);

    if (!user) return; // Must be logged in to vote

    // Check if user already voted on this comment
    const existingVote = currentVotes.find(
      (vote) => vote.commentId === commentId && vote.userId === user.id
    );

    let voteChange = value;

    // If already voted, remove old vote value
    if (existingVote) {
      voteChange = value - existingVote.value;

      // Update existing vote
      const updatedVotes = currentVotes.map((vote) => {
        if (vote.commentId === commentId && vote.userId === user.id) {
          return { ...vote, value };
        }
        return vote;
      });

      set(votesState, updatedVotes);
    } else {
      // Add new vote
      const newVote = {
        id: uuidv4(),
        commentId,
        userId: user.id,
        value
      };

      set(votesState, [...currentVotes, newVote]);
    }

    // Update comment vote status
    const updatedComments = currentComments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          voteStatus: comment.voteStatus + voteChange
        };
      }
      return comment;
    });

    set(commentsState, updatedComments);
  }
});
