"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Mock Clerk Provider
export const ClerkProvider = ({ children }: any) => {
  return <>{children}</>;
};

// Mock useUser Hook
export const useUser = () => {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "winkey-admin-id",
      fullName: "WinKey Admin",
      primaryEmailAddress: {
        emailAddress: "admin@winkey.vn",
      },
      emailAddresses: [
        {
          emailAddress: "admin@winkey.vn",
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    },
  };
};

// Mock useAuth Hook
export const useAuth = () => {
  const router = useRouter();
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: "winkey-admin-id",
    orgId: "winkey-org-id",
    signOut: () => router.push("/"),
  };
};

// Mock useOrganization Hook
export const useOrganization = () => {
  return {
    isLoaded: true,
    organization: {
      id: "winkey-org-id",
      name: "WinKey Workspace",
      slug: "winkey",
      imageUrl: "",
      hasImage: false,
    },
    membership: {
      role: "admin",
      permissions: [],
    },
  };
};

// Mock useOrganizationList Hook accepting optional params
export const useOrganizationList = (params?: any) => {
  return {
    isLoaded: true,
    setActive: async (args?: any) => {},
    userMemberships: {
      data: [
        {
          id: "winkey-membership-id",
          role: "admin",
          organization: {
            id: "winkey-org-id",
            name: "WinKey Workspace",
            slug: "winkey",
            imageUrl: "",
            hasImage: false,
          },
        },
      ],
      revalidate: async () => {},
    },
  };
};

// Mock components accepting any props to prevent TS errors
export const Show = ({ children }: any) => <>{children}</>;

export const SignOutButton = ({ children }: any) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };
  return <span onClick={handleClick} style={{ cursor: "pointer" }}>{children}</span>;
};

// Mock Custom Sign In Form component
export const SignIn = (props: any) => {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@winkey.vn");
  const [password, setPassword] = React.useState("123456");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div 
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        borderRadius: "12px",
        padding: "32px",
      }}
    >
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-midnight-ink)", marginBottom: "8px", textAlign: "center" }}>
        Admin Dashboard
      </h2>
      <p style={{ fontSize: "0.85rem", color: "var(--color-ash)", textAlign: "center", marginBottom: "24px" }}>
        Đăng nhập vào hệ thống quản lý WinKey
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>EMAIL ĐĂNG NHẬP</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", fontSize: "0.85rem" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-midnight-ink)" }}>MẬT KHẨU</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", fontSize: "0.85rem" }}
          />
        </div>

        <button 
          type="submit" 
          className="btn-grad" 
          style={{ padding: "12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
        >
          Đăng Nhập Admin
        </button>
      </form>
    </div>
  );
};

export const SignUp = (props: any) => {
  return <SignIn />;
};

export const UserProfile = (props: any) => (
  <div style={{ padding: "20px", background: "#ffffff", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)" }}>
    <h3>Hồ sơ quản trị viên</h3>
    <p>Họ tên: WinKey Admin</p>
    <p>Email: admin@winkey.vn</p>
  </div>
);

export const PricingTable = (props: any) => <div>Pricing Plan Settings Dashboard</div>;
export const OrganizationList = (props: any) => <div>Workspace Settings Management</div>;
export const OrganizationProfile = (props: any) => <div>Workspace Profile Settings</div>;
