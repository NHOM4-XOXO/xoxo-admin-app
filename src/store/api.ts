import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define types for our data
export interface Stats {
  id: number
  totalUsers: number
  newUsersToday: number
  totalPosts: number
  newPostsToday: number
  pendingReports: number
  onlineUsers: number
  engagementRate: number
  updatedAt: string
}

export interface Activity {
  id: number
  type: 'report' | 'user' | 'post'
  message: string
  time: string
  urgent: boolean
  userId?: string
  postId?: string
  createdAt: string
}

export interface TopPost {
  id: number
  title: string
  likes: number
  comments: number
  shares: number
  authorId: string
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  coverPhoto?: string
  bio?: string
  location?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  role: 'user' | 'admin'
  status: 'active' | 'banned'
  createdAt: string
  friends?: number[]
  followers?: number[]
  following?: number[]
}

export interface Post {
  id: number
  author: string
  authorAvatar?: string
  content: string
  image?: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  status: 'published' | 'reported' | 'hidden'
  reports: number
}

export interface Report {
  id: number
  author: string
  authorAvatar?: string
  content: string
  image?: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  status: 'published' | 'reported' | 'hidden'
  reports: number
}

export interface ChartDataPoint {
  date: string
  users?: number
  posts?: number
}

export interface ChartData {
  userGrowth: ChartDataPoint[]
  postActivity: ChartDataPoint[]
}

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001', // JSON Server default port
  }),
  tagTypes: ['Stats', 'Activities', 'TopPosts', 'Users', 'Posts', 'Reports', 'ChartData'],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getStats: builder.query<Stats, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
    }),
    getActivities: builder.query<Activity[], void>({
      query: () => '/activities',
      providesTags: ['Activities'],
    }),
    getTopPosts: builder.query<TopPost[], void>({
      query: () => '/topPosts',
      providesTags: ['TopPosts'],
    }),
    getChartData: builder.query<ChartData, void>({
      query: () => '/chartData',
      providesTags: ['ChartData'],
    }),
    
    // User management endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    createUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...user,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    
    // Post management endpoints
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Posts'],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: ['Posts'],
    }),
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Posts', 'Stats', 'TopPosts'],
    }),
    deletePost: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts', 'Stats', 'TopPosts'],
    }),
    createPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...post,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Posts', 'Stats', 'TopPosts'],
    }),
    
    // Report management endpoints (posts that need moderation)
    getReports: builder.query<Report[], void>({
      query: () => '/reports',
      providesTags: ['Reports'],
    }),
    updateReport: builder.mutation<Report, Partial<Report> & Pick<Report, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/reports/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Reports', 'Stats'],
    }),
    
    // Real-time updates
    refreshStats: builder.mutation<Stats, void>({
      query: () => ({
        url: '/stats',
        method: 'GET',
      }),
      invalidatesTags: ['Stats'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetStatsQuery,
  useGetActivitiesQuery,
  useGetTopPostsQuery,
  useGetChartDataQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  useGetReportsQuery,
  useUpdateReportMutation,
  useRefreshStatsMutation,
} = apiSlice 