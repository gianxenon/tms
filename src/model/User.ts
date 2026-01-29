export interface User { 
    name: string;
    userid: string;
    avatar?: string | null;       // profile photo
    role?: string;                // e.g. "admin", "driver", "dispatcher"
    status?: string;              // e.g. "active", "inactive"
  
    // Laravel authentication fields
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
  
    // Optional fields if your backend returns them
    department?: string | null;
    position?: string | null;
    phone?: string | null;
  
    // Token field (optional if stored separately)
    token?: string;
  }
  