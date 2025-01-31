"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    redirect("/post/list?page=0");
  }, []);

  return null; // 페이지가 리디렉션되면 렌더링할 내용이 필요 없으므로 null 반환
}