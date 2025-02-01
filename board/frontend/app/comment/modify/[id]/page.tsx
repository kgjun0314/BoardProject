"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type Comment = {
    commentId: number;
    content: string;
    createdDate: string;
    siteUserName: string;
};

const schema = yup.object().shape({
  content: yup.string().required("내용은 필수항목입니다."),
});

export default function PostCreate() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [data, setData] = useState<Comment | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const { id } = useParams();

    const router = useRouter();

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
                    setErrorMessage("User not found");
                }
            })
            .catch(() => setErrorMessage("Failed to fetch user"));
        }
    }, []);

    interface FormData {
        content: string;
    }

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comment/modify/${id}`, {
                method: "PATCH",
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

            router.back();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
            const res = await fetch(`http://localhost:8080/api/comment/detail/${id}`, {
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

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>댓글을 불러오는 데 실패했습니다.</div>;

    return (
        <div className="container">
            <h5 className="my-3 border-bottom pb-2">댓글 수정하기</h5>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <textarea className="form-control" rows={10} defaultValue={data.content} {...register("content")} />
                    {errors.content && <div className="text-danger">{errors.content.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary my-2">댓글 수정</button>
            </form>
        </div>
    );
}