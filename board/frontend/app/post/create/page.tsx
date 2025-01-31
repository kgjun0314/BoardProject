"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  title: yup.string().max(25).required("제목은 필수항목입니다."),
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

    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");

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
        title: string;
        content: string;
    }

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch("http://localhost:8080/api/post/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    username: username,  // 사용자 이름 추가
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            router.push("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="container">
            <h5 className="my-3 border-bottom pb-2">글 작성하기</h5>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="form-label">제목</label>
                    <input type="text" className="form-control" {...register("title")} />
                    {errors.title && <div className="text-danger">{errors.title.message}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <textarea className="form-control" rows={10} {...register("content")} />
                    {errors.content && <div className="text-danger">{errors.content.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary my-2">글 작성</button>
            </form>
        </div>
    );
}