"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";


const schema = yup.object().shape({
  username: yup.string().min(3).max(25).required("사용자ID는 필수항목입니다."),
  password1: yup.string().required("비밀번호는 필수항목입니다."),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수항목입니다."),
  email: yup.string().email("올바른 이메일 형식이 아닙니다.").required("이메일은 필수항목입니다."),
});

export default function SiteUserSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState("");

  interface FormData {
    username: string;
    password1: string;
    password2: string;
    email: string;
  }

  const router = useRouter(); // useRouter 훅 사용

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/siteuser/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password1,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message); // 백엔드에서 전달된 에러 메시지 사용
      }

      alert("회원가입 성공!");
      router.back(); // 리다이렉트
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="container my-3">
      <h4>회원가입</h4>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">사용자 ID</label>
          <input type="text" className="form-control" {...register("username")} />
          {errors.username && <div className="text-danger">{errors.username.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">비밀번호</label>
          <input type="password" className="form-control" {...register("password1")} />
          {errors.password1 && <div className="text-danger">{errors.password1.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">비밀번호 확인</label>
          <input type="password" className="form-control" {...register("password2")} />
          {errors.password2 && <div className="text-danger">{errors.password2.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">이메일</label>
          <input type="email" className="form-control" {...register("email")} />
          {errors.email && <div className="text-danger">{errors.email.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">회원가입</button>
      </form>
    </div>
  );
}
