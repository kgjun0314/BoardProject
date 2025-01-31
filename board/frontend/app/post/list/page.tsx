"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PostList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0", 10);
  const [data, setData] = useState<{ content: { postId: number; title: string; createdDate: string; commentListSize: number; siteUserName: string }[]; totalPages: number } | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/api/post/list?page=${page}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, [page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "")
      .replace("/", "-")
      .replace("/", "-");
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const hasPrevious = page > 0;
  const hasNext = page < data.totalPages - 1;

  return (
    <div className="container my-3">
      <table className="table">
        <thead className="table-dark">
          <tr className="text-center">
            <th>번호</th>
            <th style={{ width: "50%" }}>제목</th>
            <th>글쓴이</th>
            <th>작성일시</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((post: { postId: number; title: string; createdDate: string; commentListSize: number; siteUserName: string }) => (
            <tr className="text-center" key={post.postId}>
              <td>{post.postId}</td>
              <td className="text-start">
                <Link href={`/post/detail/${post.postId}`}>
                  {post.title}
                </Link>
                <span className="text-danger small ms-2">
                  {post.commentListSize > 0 && post.commentListSize}
                </span>
              </td>
              <td><span>{post.siteUserName}</span></td>
              <td>{formatDate(post.createdDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 처리 */}
      <div className="pagination justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item ${!hasPrevious ? "disabled" : ""}`}>
            <Link href={`?page=${page - 1}`} className="page-link" aria-disabled={!hasPrevious}>
              이전
            </Link>
          </li>

          {Array.from({ length: data.totalPages }, (_, index) => index)
            .filter(
              (pageIndex) =>
                pageIndex >= page - 5 && pageIndex <= page + 5
            )
            .map((filteredPage) => (
              <li key={filteredPage} className={`page-item ${filteredPage === page ? "active" : ""}`}>
                <Link href={`?page=${filteredPage}`} className="page-link">
                  {filteredPage + 1}
                </Link>
              </li>
            ))}

          <li className={`page-item ${!hasNext ? "disabled" : ""}`}>
            <Link href={`?page=${page + 1}`} className="page-link" aria-disabled={!hasNext}>
              다음
            </Link>
          </li>
        </ul>
      </div>
      <Link href={`/post/create`} className={`btn btn-primary ${!token ? "disabled" : ""}`} aria-disabled={!token}>
        글 작성하기
      </Link>
    </div>
  );
}