'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
  sender?: { full_name: string }
}

type Conversation = {
  order_id: string
  gig_title?: string
  project_title?: string
  other_user_name: string
  last_message?: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserId(session.user.id)

      // Fetch distinct orders where user is buyer or seller
      // This is a bit complex in Supabase simple query, simplified for MVP:
      // We fetch all orders involved, then populate manually.

      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          gig:gigs(title),
          project:projects(title),
          buyer:users!buyer_id(id, full_name),
          seller:users!seller_id(id, full_name)
        `)
        .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)

      if (orders) {
        const convos = orders.map((o: any) => ({
          order_id: o.id,
          gig_title: o.gig?.title,
          project_title: o.project?.title,
          other_user_name: o.buyer.id === session.user.id ? o.seller.full_name : o.buyer.full_name
        }))
        setConversations(convos)
        if (convos.length > 0) setActiveOrderId(convos[0].order_id)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!activeOrderId) return

    // Load messages
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:users(full_name)')
        .eq('order_id', activeOrderId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }
    loadMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`order-${activeOrderId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `order_id=eq.${activeOrderId}` }, (payload) => {
         const newMsg = payload.new as Message
         // We need sender name, fetching it simply or just showing "User" for now for immediate update
         setMessages((prev) => [...prev, newMsg])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeOrderId])

  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
     }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeOrderId || !userId) return

    const { error } = await supabase
      .from('messages')
      .insert({
        order_id: activeOrderId,
        sender_id: userId,
        content: newMessage
      })

    if (!error) {
      setNewMessage('')
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Meddelanden</h1>
      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Konversationer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
               {conversations.length === 0 && <p className="text-sm text-muted-foreground">Inga konversationer.</p>}
               {conversations.map(c => (
                 <div
                    key={c.order_id}
                    className={cn(
                        "p-3 rounded-md cursor-pointer hover:bg-slate-100",
                        activeOrderId === c.order_id ? "bg-slate-100" : ""
                    )}
                    onClick={() => setActiveOrderId(c.order_id)}
                 >
                   <div className="font-semibold">{c.other_user_name}</div>
                   <div className="text-xs text-muted-foreground truncate">{c.gig_title || c.project_title}</div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-2 flex flex-col">
          <CardHeader className="border-b py-4">
             <CardTitle className="text-lg">
                {conversations.find(c => c.order_id === activeOrderId)?.other_user_name || 'Välj en konversation'}
             </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4" ref={scrollRef}>
             {messages.map((msg) => {
                const isMe = msg.sender_id === userId
                return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "p-3 rounded-lg max-w-[80%] text-sm",
                            isMe ? "bg-primary text-primary-foreground" : "bg-slate-100"
                        )}>
                            <p>{msg.content}</p>
                            <span className={cn("text-[10px] opacity-70 block mt-1", isMe ? "text-right" : "")}>
                                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                )
             })}
          </CardContent>
          <div className="p-4 border-t">
             <form className="flex gap-2" onSubmit={sendMessage}>
               <Input
                 placeholder="Skriv ett meddelande..."
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 disabled={!activeOrderId}
               />
               <Button type="submit" disabled={!activeOrderId}>Skicka</Button>
             </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
