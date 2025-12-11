export type UserRole = 'buyer' | 'seller' | 'both';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  bio: string | null;
  avatar_url: string | null;
  country: string;
  created_at: string;
}

export interface KycVerification {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  provider: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Gig {
  id: string;
  seller_id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  base_price: number;
  delivery_days: number;
  is_active: boolean;
  created_at: string;
  seller?: User; // Joined
}

export interface Project {
  id: string;
  buyer_id: string;
  title: string;
  description: string | null;
  budget_min: number | null;
  budget_max: number | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  buyer?: User; // Joined
  bids?: ProjectBid[];
}

export interface ProjectBid {
  id: string;
  project_id: string;
  seller_id: string;
  amount: number;
  delivery_days: number;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  seller?: User; // Joined
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  gig_id: string | null;
  project_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_payment_status: string | null;
  amount: number;
  status: 'pending_payment' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
  buyer?: User;
  seller?: User;
  gig?: Gig;
  project?: Project;
}

export interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: User;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
