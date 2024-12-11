import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addRequest as dbAddRequest, getAllRequests as dbGetAllRequests, updateRequestStatus as dbUpdateRequestStatus, getRequestsByUser as dbGetRequestsByUser } from '@/lib/db'

export interface Request {
  id: string
  code: string
  name: string
  phone: string
  type: string
  date: string
  time: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
  attachments?: string[]
  createdAt: string
}

interface RequestsStore {
  requests: Request[]
  addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt'>) => Promise<void>
  updateRequestStatus: (id: string, status: Request['status'], feedback?: string) => Promise<void>
  getRequestsByUser: (code: string) => Promise<Request[]>
  getAllRequests: () => Promise<Request[]>
  fetchRequests: () => Promise<void>
}

export const useRequestsStore = create<RequestsStore>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: async (request) => {
        await dbAddRequest(request)
        await get().fetchRequests()
      },
      updateRequestStatus: async (id, status, feedback) => {
        await dbUpdateRequestStatus(id, status, feedback || '')
        await get().fetchRequests()
      },
      getRequestsByUser: async (code) => {
        return dbGetRequestsByUser(code)
      },
      getAllRequests: async () => {
        return dbGetAllRequests()
      },
      fetchRequests: async () => {
        const requests = await dbGetAllRequests()
        set({ requests })
      }
    }),
    {
      name: 'requests-storage',
    }
  )
)

