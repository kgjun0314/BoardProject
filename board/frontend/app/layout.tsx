"use client";

import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import "../public/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  // 클라이언트에서 쿠키 값을 확인
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = () => {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("token="));
      setToken(tokenCookie ? tokenCookie.split("=")[1] : null);
    };

    getToken();

    // 로그인/로그아웃 후 쿠키가 변경되면 새로고침 없이 UI 반영
    const observer = new MutationObserver(getToken);
    observer.observe(document, { subtree: true, childList: true });

    return () => observer.disconnect();
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // 토큰 쿠키 삭제
    setToken(null); // 상태 초기화
  };

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body>
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/">Board</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {!token ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" href={`/siteuser/login`}>로그인</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href={`/siteuser/signup`}>회원가입</Link>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" href="#" onClick={handleLogout}>로그아웃</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {children}
        <Script src="/js/bootstrap.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
