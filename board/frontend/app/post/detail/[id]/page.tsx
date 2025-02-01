"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Comment = {
  commentId: number;
  content: string;
  createdDate: string;
  siteUserName: string;
};

type PostDetailData = {
  postId: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string;
  commentList: Comment[];
  siteUserName: string;
};

const schema = yup.object().shape({
  content: yup.string().required("내용이 없습니다."),
});

export default function PostDetail() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { id } = useParams();
    const [data, setData] = useState<PostDetailData | null>(null);
    const [loading, setLoading] = useState(true);

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
        try {
        const res = await fetch(`http://localhost:8080/api/post/detail/${id}`, {
            cache: "no-store",
        });
        const json = await res.json();
        setData(json);
        } catch (error) {
        console.error("Error fetching post data:", error);
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, [id]);

    const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(/,/g, "").replace(/\//g, "-");
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");

    // 쿠키에서 토큰을 가져오고, 사용자 이름을 가져오는 함수
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];
    
        if (token) {
            fetch("http://localhost:8080/api/siteuser/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    setUsername(data.username);
                } else {
                    setUsername(""); // 로그아웃 시 빈 문자열로 설정
                }
            })
            .catch(() => setUsername(""));
        } else {
            setUsername(""); // 토큰이 없으면 로그아웃 상태로 변경
        }
    }, [token]); // token이 변할 때마다 실행

    interface FormData {
        content: string;
    }

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comment/create/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: data.content,
                    username: username,  // 사용자 이름 추가
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            window.location.reload(); // 페이지 강제 새로고침
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>게시글을 불러오는 데 실패했습니다.</div>;

    return (
    <div className="container my-3">
        <h2 className="border-bottom py-2">{data.title}</h2>
        <div className="card my-3">
            <div className="card-body">
                <div className="card-text" style={{ whiteSpace: "pre-line" }}>{data.content}</div>
                <div className="d-flex justify-content-end">
                    <div className="badge bg-light text-dark p-2 text-start">
                        <div className="mb-2">
                            <span>{data.siteUserName}</span>
                        </div>
                        <div>{formatDate(data.createdDate)}</div>
                    </div>
                </div>
                <div className="my-3">
                    {data.siteUserName === username && (
                        <Link href={`/post/modify/${id}`} className="btn btn-sm btn-outline-secondary">
                            수정
                        </Link>
                    )}
                </div>
            </div>
        </div>
        <h5 className="border-bottom my-3 py-2">{data.commentList.length}개의 답변이 있습니다.</h5>
        {data.commentList.map((comment) => (
            <div className="card my-3" key={comment.commentId}>
                <div className="card-body">
                    <div className="card-text" style={{ whiteSpace: "pre-line" }}>{comment.content}</div>
                    <div className="d-flex justify-content-end">
                        <div className="badge bg-light text-dark p-2 text-start">
                            <div className="mb-2">
                                <span>{comment.siteUserName}</span>
                            </div>
                            <div>{formatDate(comment.createdDate)}</div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="my-3">
            <textarea rows={10} className="form-control" {...register("content")} disabled={!token} />
            {errors.content && <div className="text-danger">{errors.content.message}</div>}
            <button type="submit" className={`btn btn-primary my-2 ${!token ? "disabled" : ""}`} aria-disabled={!token}>댓글 등록</button>
        </form>
    </div>
  );
}
