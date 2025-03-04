"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Comment = {
  commentId: number;
  content: string;
  createdDate: string;
  modifiedDate: string | null;
  siteUserName: string;
  likeCount: number;
};

type PostDetailData = {
  postId: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate: string | null;
  commentList: Comment[];
  siteUserName: string;
  likeCount: number;
};

const schema = yup.object().shape({
  content: yup.string().required("내용이 없습니다."),
});

export default function PostDetail() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { id } = useParams();
    const [data, setData] = useState<PostDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const onSubmit = async (formData: FormData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comment/create/${id}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // 토큰 추가
                },
                body: JSON.stringify({
                    content: formData.content,
                    username: username,
                }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
    
            // 서버에서 새로운 댓글 목록을 가져옴
            const res = await fetch(`http://localhost:8080/api/post/detail/${id}`);
            const json = await res.json();
            setData(json); // 새로운 댓글 목록으로 상태 업데이트

            reset();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
    };
    

    const handleDeletePost = async () => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/post/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("게시글 삭제에 실패했습니다.");
            }

            router.push("/"); // 삭제 후 루트 페이지로 이동
        } catch (error) {
            console.error(error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    interface parameter {
        commentId: number;
    }

    const handleDeleteComment = async (param: parameter) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/comment/delete/${param.commentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("댓글 삭제에 실패했습니다.");
            }

            window.location.reload(); // 페이지 강제 새로고침
        } catch (error) {
            console.error(error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    const handleLikePost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/post/like/${id}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // 토큰 추가
                },
                body: JSON.stringify({
                    username: username,
                }),
            });
    
            if (!response.ok) {
                alert("이미 추천을 누르신 글 입니다.");
                return;
            }

            const res = await fetch(`http://localhost:8080/api/post/detail/${id}`);
            const json = await res.json();
            setData(json); // 새로운 댓글 목록으로 상태 업데이트
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
    };

    const handleLikeComment = async (param: parameter) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comment/like/${param.commentId}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // 토큰 추가
                },
                body: JSON.stringify({
                    username: username,
                }),
            });
    
            if (!response.ok) {
                alert("이미 추천을 누르신 댓글 입니다.");
                return;
            }

            // 서버에서 새로운 댓글 목록을 가져옴
            const res = await fetch(`http://localhost:8080/api/post/detail/${id}`);
            const json = await res.json();
            setData(json); // 새로운 댓글 목록으로 상태 업데이트
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
                    {data.modifiedDate && (
                        <div className="badge bg-light text-dark p-2 text-start mx-3">
                            <div className="mb-2">modified at</div>
                            <div>{formatDate(data.modifiedDate)}</div>
                        </div>
                    )}
                    <div className="badge bg-light text-dark p-2 text-start">
                        <div className="mb-2">
                            <span>{data.siteUserName}</span>
                        </div>
                        <div>{formatDate(data.createdDate)}</div>
                    </div>
                </div>
                <div className="my-3 d-flex align-items-center">
                    <div className="me-1">
                        <button onClick={handleLikePost} className={`recommend btn btn-sm btn-outline-secondary ${!token ? "disabled" : ""}`} aria-disabled={!token}>
                            추천
                            <span className="badge rounded-pill bg-success ms-1">{data.likeCount}</span>
                        </button>
                    </div>
                    {data.siteUserName === username && (
                        <div>
                            <Link href={`/post/modify/${id}`} className="btn btn-sm btn-outline-secondary me-1">
                                수정
                            </Link>
                            <button onClick={handleDeletePost} className="btn btn-sm btn-outline-danger">
                                삭제
                            </button>
                        </div>
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
                        {comment.modifiedDate && (
                            <div className="badge bg-light text-dark p-2 text-start mx-3">
                                <div className="mb-2">modified at</div>
                                <div>{formatDate(comment.modifiedDate)}</div>
                            </div>
                        )}
                        <div className="badge bg-light text-dark p-2 text-start">
                            <div className="mb-2">
                                <span>{comment.siteUserName}</span>
                            </div>
                            <div>{formatDate(comment.createdDate)}</div>
                        </div>
                    </div>
                    <div className="my-3 d-flex align-items-center">
                        <div className="me-1">
                            <button onClick={() => handleLikeComment({ commentId: comment.commentId })} className={`recommend btn btn-sm btn-outline-secondary ${!token ? "disabled" : ""}`} aria-disabled={!token}>
                                추천
                                <span className="badge rounded-pill bg-success ms-1">{comment.likeCount}</span>
                            </button>
                        </div>
                    {comment.siteUserName === username && (
                        <div>
                            <Link href={`/comment/modify/${comment.commentId}`} className="btn btn-sm btn-outline-secondary me-1">
                                수정
                            </Link>
                            <button onClick={() => handleDeleteComment({ commentId: comment.commentId })} className="btn btn-sm btn-outline-danger">
                                삭제
                            </button>
                        </div>
                    )}
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
