"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:8080/api/siteuser/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("사용자 ID 또는 비밀번호를 확인해 주세요.");
      return;
    }

    const data = await res.json();
    document.cookie = `token=${data.token}; path=/;`;

    router.back();
  };

  return (
    <div className="container my-3">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">사용자 ID</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">로그인</button>
      </form>
    </div>
  );
}
